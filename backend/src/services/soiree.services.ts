import { PrismaClient, Prisma } from "@prisma/client";
import { DatabaseError, BadStateDataBase, CustomErrors, ImpossibleToParticipate } from "../errors/customErrors";
type PrismaTransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">



export const serviceGetSoireeById = async (id: number, prisma: PrismaClient | PrismaTransactionClient) => {
    try {
        return await prisma.soiree.findUniqueOrThrow({
            where : { id: id},
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



export const serviceGetSoireeByName = async(name: string, prisma: PrismaClient | PrismaTransactionClient) => {
    try {
        return await prisma.soiree.findMany({
            where: {
                nom: {equals: name,},
            }
        });
    } catch(error) {
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



export const serviceGetSoirees = async(now: Date, active:any, prisma: PrismaClient | PrismaTransactionClient) => {
    try {
        return await prisma.soiree.findMany({
            where: active === 'true' ? { fin: { gt: now } } : {},
        });
    } catch(error) {
        throw (error)
    }
};

export const serviceDeleteSoiree = async (soireeId: number, prisma: PrismaClient | PrismaTransactionClient) => {
    if (!soireeId || isNaN(soireeId)) {
        return { success: false, reason: "Invalid or missing soiree ID" };
    }

    try {
        const existingSoiree = await prisma.soiree.findUnique({
            where: { id: soireeId },
        });

        if (!existingSoiree) {
            return { success: false, reason: "Soiree not found" };
        }

        await prisma.soiree.delete({
            where: { id: soireeId },
        });

        return { success: true, message: "Soiree deleted successfully" };
    } catch (error) {
        console.error("Error deleting soiree:", error);
        return { success: false, reason: "Database error", error };
    }
};
