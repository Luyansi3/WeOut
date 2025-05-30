import { PrismaClient, Prisma, Tag } from "@prisma/client";
import { DatabaseError, BadStateDataBase, CustomErrors, ImpossibleToParticipate } from "../errors/customErrors";
import { serviceGetUserById } from "./user.services";
import {validateTags} from "../utils/tags.utils"
type PrismaTransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">


export const serviceGetSoireeById = async (id: number, prisma: PrismaClient | PrismaTransactionClient) => {
    try {
        return await prisma.soiree.findUniqueOrThrow({
            where: { id: id },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
            throw new DatabaseError(id, "Soiree", 400);
        else
            throw error;
    }
};



const getSoireeInInterval = async (start: Date, end: Date, prisma: PrismaClient | PrismaTransactionClient) => {
    try {
        const result = await prisma.soiree.findMany({
            where: {
                AND: [
                    {
                        // La soirée doit commencer avant ou pendant la fin de l'intervalle recherché
                        debut: {
                            lte: end,
                        },
                    },
                    {
                        // La soirée doit finir après ou pendant le début de l'intervalle recherché
                        fin: {
                            gte: start,
                        },
                    },
                ],
            },
        });
        return result;
    } catch (error) {
        throw error; // Propagation de l'erreur, tu pourrais logger ou raffiner si besoin
    }
};



export const serviceGetSoireeByName = async (name: string, prisma: PrismaClient | PrismaTransactionClient) => {
    try {
        return await prisma.soiree.findMany({
            where: {
                nom: { equals: name, },
            }
        });
    } catch (error) {
        throw (error)
    }
};





export const getSoireeInIntervalAndId = async (start: Date, end: Date, id: string, prisma: PrismaClient | PrismaTransactionClient) => {
    try {
        const result = await prisma.soiree.findMany({
            where: {
                AND: [
                    {
                        // La soirée commence avant ou pendant la fin de l'intervalle
                        debut: {
                            lte: end,
                        },
                    },
                    {
                        // Elle se termine après ou pendant le début de l'intervalle
                        fin: {
                            gte: start,
                        },
                    },
                    {
                        // On filtre pour ne garder que les soirées où un des groupes participants
                        // contient un utilisateur ayant l'id donné
                        groupes: {
                            some: {
                                users: {
                                    some: {
                                        id: id,
                                    },
                                },
                            },
                        },
                    },
                ],
            },
        });
        return result;
    } catch (error) {
        throw error;
    }
};



export const serviceGetSoirees = async (isStrictTag: boolean,from: Date | null, to: Date | null, tags : Tag[] ,prisma: PrismaClient | PrismaTransactionClient) => {
    
    try {
        return await prisma.soiree.findMany({
            where: {
            ...(from !== null ? {debut : {gte : from}} : {}),
            ...(to !== null ? {fin : {lte : to}} : {}),
            ...(tags.length ? {tags : {
                [isStrictTag ? 'hasEvery' : 'hasSome'] : tags
            }} : {}),
            },            
        });
    } catch (error) {
        throw (error)
    }
};





export const serviceDeleteSoiree = async (
    soireeId: number,
    prisma: PrismaClient | PrismaTransactionClient
) => {
    if (!soireeId || isNaN(soireeId)) {
        return { success: false, reason: 'Invalid or missing soiree ID' };
    }

    // ------------------------------------------------------
    const run = async (tx: PrismaTransactionClient) => {
        const existingSoiree = await tx.soiree.findUnique({
            where: { id: soireeId },
            include: {
                groupes: {
                    include: { users: true },
                },
            },
        });

        if (!existingSoiree) throw new Error('NOT_FOUND');

        const now = new Date();
        const shouldDecrement = now < existingSoiree.debut; // soirée pas encore commencée ?

        if (shouldDecrement) {
            console.log("should decrement");
            const userIds = new Set<string>();
            existingSoiree.groupes.forEach((g: { users: { id: string }[] }) =>
                g.users.forEach((u) => userIds.add(u.id))
            );

            // décrémente sans jamais passer en négatif
            await Promise.all(
                [...userIds].map((userId) =>
                    tx.user.updateMany({
                        where: { id: userId, nombreSoiree: { gt: 0 } },
                        data: { nombreSoiree: { decrement: 1 } },
                    })
                )
            );
        }

        await tx.commentaire.deleteMany({ where: { soireeId } });
        await tx.photo.deleteMany({ where: { soireeId } });
        await tx.groupe.deleteMany({ where: { soireeId } });

        // déconnexion des tags (champ scalaire enum → pas besoin d’include)
        await tx.soiree.update({
            where: { id: soireeId },
            data: { tags: { set: [] } },
        });

        await tx.soiree.delete({ where: { id: soireeId } });

        return true;
    };
    // ------------------------------------------------------

    try {
        const ok =
            prisma instanceof PrismaClient ? await prisma.$transaction(run) : await run(prisma);

        return { success: ok, message: 'Soiree deleted successfully' };
    } catch (error) {
        if (error instanceof Error && error.message === 'NOT_FOUND') {
            return { success: false, reason: 'Soiree not found' };
        }
        console.error('Transaction failed:', error);
        return { success: false, reason: 'Database error', error };
    }
};




export const serviceGetSoireeByUserId = async (id: string, prisma: PrismaClient | PrismaTransactionClient) => {
    try {
        await serviceGetUserById(id, prisma);
        const result = await prisma.soiree.findMany({
            where: {
                groupes: {
                    some: {
                        users: {
                            some: {
                                id: id,
                            },
                        }
                    },
                },
            },
        });
        return result;
    } catch (error) {
        throw error;
    }
}

export const servicePostSoiree = async (nom: string,
    description: string,
    photoCouverturePath: string,
    debut: Date,
    fin: Date,
    lieuId: number,
    organismeId: string,
    tags: Tag[] | unknown, prisma: PrismaClient | PrismaTransactionClient) => {
    try {
        return await prisma.soiree.create({
            data: {
                nom,
                description,
                photoCouverturePath,
                debut: new Date(debut),
                fin: new Date(fin),
                lieu: { connect: { id: Number(lieuId) } },
                organsime: { connect: { id: organismeId } },
                tags: validateTags(tags),
            }
        });
    } catch (error) {
        throw (error)
    }
}

export const serviceUpdateSoiree = async (
    id: number,
    data: {
        nom?: string,
        description?: string,
        photoCouverturePath?: string,
        debut?: Date,
        fin?: Date,
        lieuId?: number,
        organismeId?: string,
        tags?: any // adapte selon ta gestion des enums
    },
    prisma: PrismaClient | PrismaTransactionClient
) => {
    try {
        await serviceGetSoireeById(id, prisma);

        return await prisma.soiree.update({
            where: { id },
            data
        });
    } catch (error) {
        throw error;
    }
};




export const serviceGetGroupsBySoireeId = async (
    soireeId: number,
    prisma: PrismaClient | PrismaTransactionClient
) => {
    try {
        await serviceGetSoireeById(soireeId, prisma);
        const groupes = await prisma.groupe.findMany({
            where: { soireeId },
            include: {
                users: true,
            },
        });
        return {
            success: true,
            groupes,
        };
    } catch (error) {
        if (error instanceof DatabaseError) {
            return {
                success: false,
                reason: 'Soiree not found',
            };
        }
        console.error("Error fetching groups by soiree ID:", error);
        return {
            success: false,
            reason: "Database error",
            error,
        };
    }
};




export const serviceGetEventsByDatesAndId = async (id: string, isBefore: boolean,
    prisma: PrismaClient | PrismaTransactionClient, date: Date = new Date()) => {
    console.log(date);
    try {
        await serviceGetUserById(id, prisma);
        return await prisma.soiree.findMany({
            where: {
                groupes: {
                    some: {
                        users: {
                            some: {
                                id: id,
                            },
                        }
                    },
                },
            },
            //fin : (isBefore ? {lte: date} : {gt: date})
        });
    } catch (error) {
        throw error;
    }
}


export const serviceGetSoireeParticipants = async (
    soireeId: number,
    prisma: PrismaClient | PrismaTransactionClient
) => {
    try {
        await serviceGetSoireeById(soireeId, prisma);
        const groupes = await prisma.groupe.findMany({
            where: { soireeId },
            include: { users: true },
        });
        const participantsMap = new Map<string, any>();
        groupes.forEach(group =>
            group.users.forEach(user => {
                participantsMap.set(user.id, user);
            })
        );
        return {
            success: true,
            participants: Array.from(participantsMap.values()),
        };
    } catch (error) {
        if (error instanceof DatabaseError) {
            return {
                success: false,
                reason: 'Soiree not found',
                id: error.id,
                code: error.code,
            };
        }

        console.error('Error retrieving soiree participants:', error);
        return {
            success: false,
            reason: 'Database error',
            error,
        };
    }
};

export const serviceGetCommentsBySoireeId = async (
    soireeId: number,
    prisma: PrismaClient | PrismaTransactionClient
  ) => {
    try {
      await serviceGetSoireeById(soireeId, prisma);
      const commentaires = await prisma.commentaire.findMany({
        where: { soireeId },
        include: {
          createur: {
            select: {
              id: true,
              prenom: true,
              nom: true,
            },
          },
        },
      });
      return {
        success: true,
        commentaires,
      };
    } catch (error) {
      if (error instanceof DatabaseError) {
        return {
          success: false,
          reason: 'Soiree not found',
          id: error.id,
          code: error.code,
        };
      }
  
      console.error('Error retrieving comments:', error);
      return {
        success: false,
        reason: 'Database error',
        error,
      };
    }
  };


  export const serviceSearchSoireeByText = async (
    query: string,
    prisma: PrismaClient | PrismaTransactionClient
  ) => {
    if (!query || query.trim().length < 2) {
      return {
        success: false,
        reason: 'Query is too short or empty',
      };
    }
  
    const lowered = query.toLowerCase();
    const upper   = query.toUpperCase() as Tag;
  
    const matchingTags: Tag[] = Object
      .values(Tag)
      .filter(tag => tag.toLowerCase().includes(lowered)) as Tag[];
  
    try {
      const whereOR: Prisma.SoireeWhereInput[] = [
        {
          nom: {
            contains: lowered,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: lowered,
            mode: 'insensitive',
          },
        },
        {
          lieu: {
            nom: {
              contains: lowered,
              mode: 'insensitive',
            },
          },
        },
      ];
   
      matchingTags.forEach(tagVal => {
        whereOR.push({
          tags: {
            has: tagVal,
          },
        });
      });
  
      const soirees = await prisma.soiree.findMany({
        where: {
          OR: whereOR,
        },
        include: {
          lieu: true,           
        },
      });
  
      return {
        success: true,
        count: soirees.length,
        results: soirees,
      };
    } catch (error) {
      console.error('Error in serviceSearchSoireeByText:', error);
      return {
        success: false,
        reason: 'Database error',
        error,
      };
    }
  };




export const serviceIsSoireeNow = async (eventId : number, prisma : PrismaClient | PrismaTransactionClient) : Promise<boolean> => {
    const now = new Date();
    try {
        const soiree = await serviceGetSoireeById(eventId, prisma);
        return (soiree.fin > now && soiree.debut < now);
    } catch(error) {
        throw error;
    }
}