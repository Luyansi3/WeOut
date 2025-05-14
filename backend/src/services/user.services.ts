import { PrismaClient, Prisma, Soiree, Tag } from "@prisma/client";
import { connect } from "http2";
import { userInfo } from "os";
import {
    serviceGetSoireeById,
    getSoireeInIntervalAndId
} from "../services/soiree.services";
import { DatabaseError, BadStateDataBase, ImpossibleToParticipate, UniqueAttributeAlreadyExists, InvalidCredentials } from "../errors/customErrors";
import { hashPassword, comparePassword } from '../utils/hash';
import { SECRET_KEY } from "../server";
import jwt from 'jsonwebtoken';
import { error } from "console";
import { calculateCompatibility } from "../utils/score.utils";

type PrismaTransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">




//Todo, defin hierarchy and rules
type FriendshipStatus =
    | 'already_sent'
    | 'already_received'
    | 'already_friends'
    | 'blocked'
    | 'blocked_by'
    | 'no_relation';


export const serviceCheckFriendshipStatus = async (senderId: string, receiverId: string, prisma: PrismaClient | PrismaTransactionClient): Promise<FriendshipStatus> => {
    //Get the sender (or active person)
    let sender;
    let receiver;
    try {
        sender = await prisma.user.findUniqueOrThrow({
            where: { id: senderId },
            include: {
                demandeRecue: true,
                demandeEnvoye: true,
                bloque: true,
                bloquant: true,
                ami: true
            },
        });
        //Get the receiver (or passive person)
        receiver = await prisma.user.findUniqueOrThrow({
            where: { id: receiverId },
            include: {
                demandeRecue: true,
                demandeEnvoye: true,
                bloque: true,
                bloquant: true,
                ami: true
            },
        });
    } catch (error) {
        throw error;
    }

    //Voir toutes les configurations possibles
    const hasSent = sender.demandeEnvoye.some((user: any) => user.id == receiverId);
    const hasReceived = sender.demandeRecue.some((user: any) => user.id == receiverId);
    const hasBlocked = sender.bloque.some((user: any) => user.id == receiverId);
    const isBlocked = sender.bloquant.some((user: any) => user.id == receiverId);
    const isFriend = sender.ami.some((user: any) => user.id == receiverId);


    //Voir toutes les configuration possibles mais à l'envers
    const hasSentReverse = receiver.demandeEnvoye.some((user: any) => user.id == senderId);
    const hasReceivedReverse = receiver.demandeRecue.some((user: any) => user.id == senderId);
    const hasBlockedReverse = receiver.bloque.some((user: any) => user.id == senderId);
    const isBlockedReverse = receiver.bloquant.some((user: any) => user.id == senderId);
    const isFriendReverse = receiver.ami.some((user: any) => user.id == senderId);


    //En fonction des ocnfigurations, voir le statut
    if ((hasSent && hasReceived)
        || (hasReceivedReverse && hasSentReverse)
        || (isFriend != isFriendReverse)
        || (isFriend && (hasReceived || hasSent))
        || (isFriendReverse && (hasReceivedReverse || hasSentReverse))
    )
        throw new BadStateDataBase(receiverId, senderId);

    if (hasBlocked && isBlockedReverse)
        return 'blocked';
    if (isBlocked && hasBlockedReverse)
        return 'blocked_by'
    if (isFriend && isFriendReverse)
        return 'already_friends'
    if (hasSent && hasReceivedReverse)
        return 'already_sent'
    if (hasReceived && hasSentReverse)
        return 'already_received'

    return 'no_relation'

}



export const serviceGetUserById = async (id: string, prisma: PrismaClient | PrismaTransactionClient) => {
    try {
        return await prisma.user.findUniqueOrThrow({
            where: { id },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
            throw new DatabaseError(id, "User", 400);
        else
            throw error;
    }
};


export const serviceSendFriendRequest = async (senderId: string, receiverId: string, prisma: PrismaClient) => {
    //Get the status of the relationship
    const relationStatus: FriendshipStatus = await serviceCheckFriendshipStatus(senderId, receiverId, prisma);


    //Regarding the status, return all the errors possible
    if (!relationStatus)
        return { success: false, reason: 'invalid IDs' };
    if (relationStatus == 'blocked' || relationStatus == 'blocked_by')
        return { success: false, reason: 'someone is blocked' };
    if (relationStatus == 'already_friends')
        return { success: false, reason: 'already friends' };
    if (relationStatus == 'already_received' || relationStatus == 'already_sent')
        return { success: false, reason: 'request already made' };


    //Make the transaction so the friend request is sent
    try {
        await prisma.$transaction([prisma.user.update({
            where: { id: senderId },
            data: {
                demandeEnvoye: {
                    connect: { id: receiverId },
                },
            },
        }),
        prisma.user.update({
            where: { id: receiverId },
            data: {
                demandeRecue: {
                    connect: { id: senderId },
                },
            },
        })
        ]);

    } catch (error) {
        throw error;
    }
    return { success: true };
};



export const serviceDeclineFriendRequest = async (senderId: string, receiverId: string, prisma: PrismaClient) => {
    //Get the status of the relationship
    const relationStatus: FriendshipStatus = await serviceCheckFriendshipStatus(senderId, receiverId, prisma);


    //Regarding the status, return all the errors possible
    if (!relationStatus)
        return { success: false, reason: 'invalid IDs' };
    if (relationStatus == 'blocked' || relationStatus == 'blocked_by')
        return { success: false, reason: 'someone is blocked' };
    if (relationStatus == 'already_friends')
        return { success: false, reason: 'already friends' };
    if (relationStatus == 'already_received')
        return { success: false, reason: 'friend request sent and not received' };
    if (relationStatus == 'no_relation')
        return { success: false, reason: 'no friend request received' };

    //Make the transaction so the friend request is sent
    try {
        await prisma.$transaction([prisma.user.update({
            where: { id: senderId },
            data: {
                demandeEnvoye: {
                    disconnect: { id: receiverId },
                },
            },
        }),
        prisma.user.update({
            where: { id: receiverId },
            data: {
                demandeRecue: {
                    disconnect: { id: senderId },
                },
            },
        })
        ]);

    } catch (error) {
        throw error;
    }
    return { success: true };

}


export const serviceAcceptFriendRequest = async (senderId: string, receiverId: string, prisma: PrismaClient) => {
    //Get the status of the relationship
    const relationStatus: FriendshipStatus = await serviceCheckFriendshipStatus(senderId, receiverId, prisma);

    //Regarding the status, return all the errors possible
    if (!relationStatus)
        return { success: false, reason: 'invalid IDs' };
    if (relationStatus == 'blocked' || relationStatus == 'blocked_by')
        return { success: false, reason: 'someone is blocked' };
    if (relationStatus == 'already_friends')
        return { success: false, reason: 'already friends' };
    if (relationStatus == 'already_received')
        return { success: false, reason: 'friend request sent and not received' };
    if (relationStatus == 'no_relation')
        return { success: false, reason: 'no friend request received' };


    //Make the transaction so the friend request is sent
    try {
        await prisma.$transaction([prisma.user.update({
            where: { id: senderId },
            data: {
                demandeEnvoye: {
                    disconnect: { id: receiverId },
                },
                ami: {
                    connect: { id: receiverId },
                },
                nombreAmis : {
                    increment : 1
                },
            },
        }),
        prisma.user.update({
            where: { id: receiverId },
            data: {
                demandeRecue: {
                    disconnect: { id: senderId },
                },
                ami: {
                    connect: { id: senderId },
                },
                nombreAmis : {
                    increment : 1
                },
            },
        })
        ]);

    } catch (error) {
        throw error;
    }
    return { success: true };
}


export const serviceGetListFriends = async (id: string, prisma: PrismaClient | PrismaTransactionClient) => {


    try {
        //Validate the id
        await prisma.user.findUniqueOrThrow({
            where: { id: id },
        });
        const friends = await prisma.user.findMany({
            where: {
                ami: {
                    some: { id: id }
                },
            },
        });
        return friends;
    } catch (error) {
        throw (error);
    }
};

export const serviceParticipateEvent = async (userId: string, partyId: number, prisma: PrismaClient) => {
    try {
        //Faire une transaction
        await prisma.$transaction( async(tx) => {

        if (await serviceIsSubscribed(userId, partyId, tx)) {
            throw new Error("The user already participate to the party");
        }
        const soiree = await serviceGetSoireeById(partyId, tx);
        const user = await serviceGetUserById(userId, tx);
        const concurrentParties = await getSoireeInIntervalAndId(soiree.debut, soiree.fin, userId, tx);
        if (concurrentParties.length !== 0) {
            throw new ImpossibleToParticipate(400, partyId, userId);
        }

        const updatesSoiree : Partial<Soiree> = {};

        
        
        

        if (soiree.dancing) {
            if (user.dancing) {
                updatesSoiree.dancing = (soiree.dancing * soiree.nbNoteDancing + user.dancing) / (soiree.nbNoteDancing + 1);
                updatesSoiree.nbNoteDancing = soiree.nbNoteDancing + 1;
            } 
        } else {
            updatesSoiree.dancing = user.dancing;
        }

        if (soiree.talking) {
            if (user.talking) {
                updatesSoiree.talking = (soiree.talking * soiree.nbNoteTalking + user.talking) / (soiree.nbNoteTalking + 1);
                updatesSoiree.nbNoteTalking = soiree.nbNoteTalking + 1;
            }
        }else {
            updatesSoiree.talking = user.talking;
        }
        
        if (soiree.alcohool) {
            if (user.alcohool) {
                updatesSoiree.alcohool = (soiree.alcohool * soiree.nbNoteAlcohool + user.alcohool) / (soiree.nbNoteAlcohool + 1);
                updatesSoiree.nbNoteAlcohool = soiree.nbNoteAlcohool + 1;
            } 
        } else {
            updatesSoiree.alcohool = user.alcohool;
        }

        updatesSoiree.nombreParticipants = soiree.nombreParticipants + 1;
        
            await tx.user.update({
                where: { id: userId },
                data: {
                    nombreSoiree: {
                        increment: 1,
                    },
                },
            });
            await tx.soiree.update({
                where: { id: partyId },
                data: {
                    ...updatesSoiree,
                },
            });
            await tx.groupe.create({
                data: {
                    users: {
                        connect: [
                            { id: userId }
                        ]
                    },
                    soiree: {
                        connect: { id: partyId },
                    },
                },
            });
            return;
        });
    } catch (error) {
        throw error;
    }

    return { success: true };
}



type Genre = 'HOMME' | 'FEMME' | 'AUTRE';

type UserUpdateData = {
    prenom?: string;
    nom?: string;
    genre?: Genre;
    longitude?: number;
    latitude?: number;
}
export const serviceSignupUser = async (data: { firstname: string, lastname: string, username: string, email: string; password: string }, prisma: PrismaClient) => {

    const hashed = await hashPassword(data.password);

    const existingEmail = await prisma.compte.findUnique({
        where: { email: data.email },
    });
    if (existingEmail) {

        throw new UniqueAttributeAlreadyExists(400, 'Email already used');
    }

    const existingUsername = await prisma.user.findUnique({
        where: { pseudo: data.username },
    });

    if (existingUsername) {
        throw new UniqueAttributeAlreadyExists(400, 'Username already used');
    }

    try {

        const compteCreated = await prisma.compte.create({
            data: {
                email: data.email,
                hashedMdp: hashed,
            }
        });

        const user = await prisma.user.create({
            data: {
                prenom: data.firstname,
                nom: data.lastname,
                pseudo: data.username,
                compte: { connect: { id: compteCreated.id } }
            }
        });
        return { compteCreated, user };
    }
    catch (error) {
        throw error;
    }


};




function validateUserUpdateData(data: UserUpdateData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.prenom !== undefined && typeof data.prenom !== 'string') {
        errors.push("prenom must be a string");
    }
    if (data.nom !== undefined && typeof data.nom !== 'string') {
        errors.push("nom must be a string");
    }
    if (
        data.genre !== undefined &&
        !['HOMME', 'FEMME', 'AUTRE'].includes(data.genre)
    ) {
        errors.push("genre must be either 'HOMME', 'FEMME', or 'AUTRE'");
    }
    if (
        data.longitude !== undefined &&
        (typeof data.longitude !== 'number' || isNaN(data.longitude))
    ) {
        errors.push("longitude must be a valid number");
    }
    if (
        data.latitude !== undefined &&
        (typeof data.latitude !== 'number' || isNaN(data.latitude))
    ) {
        errors.push("latitude must be a valid number");
    }

    return { valid: errors.length === 0, errors };
}

export const serviceUpdateUserInfo = async (
    userId: string,
    data: UserUpdateData,
    prisma: PrismaClient) => {
    // Validate fields before transaction to fail fast
    const { valid, errors } = validateUserUpdateData(data);
    if (!valid) {
        return {
            success: false,
            reason: 'Validation failed',
            errors,
        };
    }

    const run = async (tx: PrismaTransactionClient) => {
        // Ensure user exists
        await serviceGetUserById(userId, tx);

        // Update only provided fields, and force updated timestamp
        const updatedUser = await tx.user.update({
            where: { id: userId },
            data: {
                ...(data.prenom !== undefined && { prenom: data.prenom }),
                ...(data.nom !== undefined && { nom: data.nom }),
                ...(data.genre !== undefined && { genre: data.genre }),
                ...(data.longitude !== undefined && { longitude: data.longitude }),
                ...(data.latitude !== undefined && { latitude: data.latitude }),
                dateActualisation: new Date(),
            },
        });

        return {
            success: true,
            message: 'User updated successfully',
            user: updatedUser,
        };
    };

    try {
        const result = await prisma.$transaction((tx) => run(tx))


        return result;
    } catch (error) {
        console.error('Error updating user in transaction:', error);
        return { success: false, reason: 'Database error', error };
    }
};

export const generateToken = (userId: string) => {
    return jwt.sign({ id: userId }, SECRET_KEY!, {
        expiresIn: '7d',
    });
};

export const serviceSigninUser = async (data: { email: string; password: string }, prisma: PrismaClient) => {

    try {
        const compte = await prisma.compte.findUnique({ where: { email: data.email } });

        if (!compte || !(await comparePassword(data.password, compte.hashedMdp))) {
            throw new InvalidCredentials(401, 'Email or password incorrect');
        }


        const user = await prisma.user.findUnique({ where: { compteId: compte.id } });
        if (!user) {
            throw new InvalidCredentials(401, "No user linked to this account");
        }

        const token = generateToken(user.id);

        return token;
    }
    catch (error) {
        throw error;
    }
};

export const serviceGetMeUser = async (id: string, prisma: PrismaClient | PrismaTransactionClient) => {
    try {

        return await prisma.user.findUniqueOrThrow({
            where: { id },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
            throw new DatabaseError(id, "User", 400);
        else
            throw error;
    }
};

export const serviceIsSubscribed = async (userId: string, eventId: number,
     prisma : PrismaClient | PrismaTransactionClient) : Promise<boolean> => {

    try {
        await serviceGetUserById(userId, prisma);
        await serviceGetSoireeById(eventId, prisma);

        const result = await prisma.soiree.findFirst({
            where: {
                groupes : {
                    some : {
                        users : {
                            some : {
                                id : userId
                            },
                        },
                    },
                },
            },
        });
        return (result != null);
    } catch(error) {
        throw error;
    }
};


export const serviceUnsubscribreEvent = async(userId: string, eventId: number, prisma: PrismaClient) => {
    try {
        

        await prisma.$transaction( async (tx) => {
        if (! await serviceIsSubscribed(userId, eventId, tx)) {
            throw new Error("The user is not subscribed to the party");
        }
        const user = await serviceGetUserById(userId, tx);
        const soiree = await serviceGetSoireeById(eventId, tx);

        
        const updatesSoiree : Partial<Soiree> = {};

        
        if (user.dancing) {
            if (soiree.dancing && soiree.nbNoteDancing > 1) {
                updatesSoiree.dancing = (soiree.dancing * soiree.nbNoteDancing - user.dancing) / (soiree.nbNoteDancing - 1);
                updatesSoiree.nbNoteDancing = soiree.nbNoteDancing - 1;
            } else {
                updatesSoiree.dancing = null;
                updatesSoiree.nbNoteDancing = 0;
            }
            
        } 
        

        if (user.talking) {
            if (soiree.talking && soiree.nbNoteTalking > 1) {
                updatesSoiree.talking = (soiree.talking * soiree.nbNoteTalking - user.talking) / (soiree.nbNoteTalking - 1);
                updatesSoiree.nbNoteTalking = soiree.nbNoteTalking - 1;
            } else {
                updatesSoiree.talking = null;
                updatesSoiree.nbNoteTalking = 0;
            }
        }
            
        
        
        if (user.alcohool) {
            if (soiree.alcohool && soiree.nbNoteAlcohool > 1) {
                updatesSoiree.alcohool = (soiree.alcohool * soiree.nbNoteAlcohool + user.alcohool) / (soiree.nbNoteAlcohool - 1);
                updatesSoiree.nbNoteAlcohool = soiree.nbNoteAlcohool - 1;
            } else {
                updatesSoiree.alcohool = null;
                updatesSoiree.nbNoteTalking = 0;
            }
        }

        updatesSoiree.nombreParticipants = soiree.nombreParticipants - 1;


        const group = await tx.groupe.findFirst({
            where : {
                soiree : {
                    id : eventId
                },
                users : {
                    some : {
                        id : userId
                    },
                },
            },
            include : {
                _count: {
                    select : {
                        users : true
                    }
                }
            }
        });

        if (group && group._count.users===1) {
            await tx.groupe.delete({
                where : {
                    id: group.id
                }
            });
        } else if (group) {
            await tx.groupe.update({
                where : {id: group.id},
                data: {
                    users : {
                        disconnect : {id : userId},
                    },
                    nombreParticipants : {
                        increment: 1
                    },
                },
            });
        }
        tx.user.update({
            where : {id: userId},
            data : {
                nombreSoiree : {
                    increment : 1
                },
            },
        });
        tx.soiree.update({
            where : {id: eventId},
            data : {
                nombreParticipants : {
                    increment : 1
                },
            },
        });
            
        });

        return {success: true};
    } catch(error) {
        throw error;
    }
};


export const serviceGetSoireeRecommendations = async (
    userId: string,
    prisma: PrismaClient | PrismaTransactionClient
) => {
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: userId },
            include: {
                ami: { select: { id: true } }
            },
        });

        const friendIds = user.ami.map((f: { id: string }) => f.id);

        const now = new Date();
        const soirees = await prisma.soiree.findMany({
            where: { debut: { gt: now } },
            include: {
                lieu: true,
                groupes: { include: { users: { select: { id: true } } } },
            },
        });

        const scored = soirees.map((s) => {
            const friendCount = new Set(
                s.groupes.flatMap((g) => g.users.map((u) => u.id)).filter((id) => friendIds.includes(id))
            ).size;

            const score = calculateCompatibility(
                s.lieu?.latitude ?? 0,
                s.lieu?.longitude ?? 0,
                (s as any).alcohol ?? 0,
                (s as any).dancing ?? 0,
                (s as any).talking ?? 0,
                friendCount,
                user.latitude ?? (s.lieu?.latitude ??0),
                user.longitude??(s.lieu?.longitude ??0),
                (user as any).alcohol ?? 0,
                (user as any).dancing ?? 0,
                (user as any).talking ?? 0
            );

            return { soiree: s, score };
        });

        scored.sort((a, b) => b.score - a.score);
        const top = scored.slice(0, 100);

        return {
            success: true,
            recommendations: top,
        };
    } catch (error) {
        console.error('Error in serviceGetSoireeRecommendations:', error);
        return {
            success: false,
            reason: 'Database error',
            error,
        };
    }
};
