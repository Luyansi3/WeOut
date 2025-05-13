import { PrismaClient, Prisma, Soiree, Tag } from "@prisma/client";
import { connect } from "http2";
import { userInfo } from "os";
import {
    serviceGetSoireeById,
    getSoireeInIntervalAndId
} from "../services/soiree.services";
import { DatabaseError, BadStateDataBase, ImpossibleToParticipate } from "../errors/customErrors";

type PrismaTransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">




//Todo, defin hierarchy and rules
type FriendshipStatus =
    | 'already_sent'
    | 'already_received'
    | 'already_friends'
    | 'blocked'
    | 'blocked_by'
    | 'no_relation'
    | null;


const checkFriendshipStatus = async (senderId: string, receiverId: string, prisma: PrismaClient | PrismaTransactionClient): Promise<FriendshipStatus> => {
    //Get the sener (or active person)
    const sender = await prisma.user.findUniqueOrThrow({
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
    const receiver = await prisma.user.findUniqueOrThrow({
        where: { id: receiverId },
        include: {
            demandeRecue: true,
            demandeEnvoye: true,
            bloque: true,
            bloquant: true,
            ami: true
        },
    });

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
    const relationStatus: FriendshipStatus = await checkFriendshipStatus(senderId, receiverId, prisma);


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
    const relationStatus: FriendshipStatus = await checkFriendshipStatus(senderId, receiverId, prisma);


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
    const relationStatus: FriendshipStatus = await checkFriendshipStatus(senderId, receiverId, prisma);

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
                }
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
                }
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
        await serviceGetUserById(userId, prisma);
        await prisma.$transaction(async (tx) => {
            const soiree = await serviceGetSoireeById(partyId, tx);
            const user = await serviceGetUserById(userId, tx);
            const concurrentParties = await getSoireeInIntervalAndId(soiree.debut, soiree.fin, userId, tx);
            if (concurrentParties.length !== 0) {
                throw new ImpossibleToParticipate(400, partyId, userId);
            }

            const updatesSoiree: Partial<Soiree> = {};





            if (soiree.dancing) {
                if (user.dancing) {
                    updatesSoiree.nbNoteDancing = soiree.nbNoteDancing + 1;
                    updatesSoiree.dancing = (soiree.dancing * soiree.nbNoteDancing + user.dancing) / (soiree.nbNoteDancing + 1);
                }
            } else {
                updatesSoiree.dancing = user.dancing;
            }

            if (soiree.talking) {
                if (user.talking) {
                    updatesSoiree.nbNoteTalking = soiree.nbNoteTalking + 1;
                    updatesSoiree.talking = (soiree.talking * soiree.nbNoteTalking + user.talking) / (soiree.nbNoteTalking + 1);
                }
            } else {
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

