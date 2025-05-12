import { PrismaClient, Prisma } from "@prisma/client";
import { connect } from "http2";
import { userInfo } from "os";
import { serviceGetSoireeById,
         getSoireeInIntervalAndId
       }  from "../services/soiree.services";
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
  

const checkFriendshipStatus = async (senderId: string, receiverId: string, prisma: PrismaClient | PrismaTransactionClient) : Promise<FriendshipStatus> => {
    //Get the sener (or active person)
    const sender = await prisma.user.findUniqueOrThrow({
        where : {id: senderId},
        include: {
            demandeRecue : true,
            demandeEnvoye : true,
            bloque : true,
            bloquant : true,
            ami : true
        },
    });
    //Get the receiver (or passive person)
    const receiver = await prisma.user.findUniqueOrThrow({
        where : {id: receiverId},
        include: {
            demandeRecue : true,
            demandeEnvoye : true,
            bloque : true,
            bloquant : true,
            ami : true
        },
    });

    //Voir toutes les configurations possibles
    const hasSent = sender.demandeEnvoye.some((user : any)=> user.id == receiverId);
    const hasReceived = sender.demandeRecue.some((user : any) => user.id == receiverId);
    const hasBlocked = sender.bloque.some((user: any)=> user.id == receiverId);
    const isBlocked = sender.bloquant.some((user: any)=> user.id == receiverId);
    const isFriend = sender.ami.some((user: any) => user.id == receiverId);


    //Voir toutes les configuration possibles mais à l'envers
    const hasSentReverse = receiver.demandeEnvoye.some((user : any)=> user.id == senderId);
    const hasReceivedReverse = receiver.demandeRecue.some((user : any) => user.id == senderId);
    const hasBlockedReverse = receiver.bloque.some((user: any)=> user.id == senderId);
    const isBlockedReverse = receiver.bloquant.some((user: any)=> user.id == senderId);
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



export const serviceGetUserById = async(id: string, prisma: PrismaClient | PrismaTransactionClient) => {
    try {
            return await prisma.user.findUniqueOrThrow({
                where: {id},
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
        return {success: false, reason: 'invalid IDs'};
    if (relationStatus == 'blocked' || relationStatus == 'blocked_by')
        return {success: false, reason: 'someone is blocked'};
    if (relationStatus == 'already_friends')
        return {success: false, reason: 'already friends'};
    if (relationStatus == 'already_received' || relationStatus=='already_sent')
        return {success : false, reason: 'request already made'};
    

    //Make the transaction so the friend request is sent
    try {
        await prisma.$transaction([prisma.user.update({
            where: {id : senderId},
            data: {
                demandeEnvoye: {
                    connect: {id : receiverId},
                },
            },
        }),
    prisma.user.update({
            where: {id : receiverId},
            data: {
                demandeRecue: {
                    connect: {id : senderId},
                },
            },
        })
    ]);
    
    } catch(error) {
        throw error;
    }
    return {success: true};
};



export const serviceDeclineFriendRequest =  async(senderId: string, receiverId: string, prisma: PrismaClient) => {
    //Get the status of the relationship
    const relationStatus: FriendshipStatus = await checkFriendshipStatus(senderId, receiverId, prisma);


    //Regarding the status, return all the errors possible
    if (!relationStatus)
        return {success: false, reason: 'invalid IDs'};
    if (relationStatus == 'blocked' || relationStatus == 'blocked_by')
        return {success: false, reason: 'someone is blocked'};
    if (relationStatus == 'already_friends')
        return {success: false, reason: 'already friends'};
    if (relationStatus == 'already_received')
        return {success: false, reason: 'friend request sent and not received'};
    if (relationStatus == 'no_relation')
        return {success: false, reason: 'no friend request received'};

    //Make the transaction so the friend request is sent
    try {
        await prisma.$transaction([prisma.user.update({
            where: {id : senderId},
            data: {
                demandeEnvoye: {
                    disconnect: {id : receiverId},
                },
            },
        }),
    prisma.user.update({
            where: {id : receiverId},
            data: {
                demandeRecue: {
                    disconnect: {id : senderId},
                },
            },
        })
    ]);
    
    } catch(error) {
        throw error;
    }
    return {success: true};
        
}


export const serviceAcceptFriendRequest = async(senderId: string, receiverId: string, prisma: PrismaClient) => {
    //Get the status of the relationship
    const relationStatus : FriendshipStatus = await checkFriendshipStatus(senderId, receiverId, prisma);

    //Regarding the status, return all the errors possible
    if (!relationStatus)
        return {success: false, reason: 'invalid IDs'};
    if (relationStatus == 'blocked' || relationStatus == 'blocked_by')
        return {success: false, reason: 'someone is blocked'};
    if (relationStatus == 'already_friends')
        return {success: false, reason: 'already friends'};
    if (relationStatus == 'already_received')
        return {success: false, reason: 'friend request sent and not received'};
    if (relationStatus == 'no_relation')
        return {success: false, reason: 'no friend request received'};


    //Make the transaction so the friend request is sent
    try {
        await prisma.$transaction([prisma.user.update({
            where: {id : senderId},
            data: {
                demandeEnvoye: {
                    disconnect: {id : receiverId},
                },
                ami: {
                    connect: {id: receiverId},
                }
            },
        }),
    prisma.user.update({
            where: {id : receiverId},
            data: {
                demandeRecue: {
                    disconnect: {id : senderId},
                },
                ami: {
                    connect: {id: senderId},
                }
            },
        })
    ]);
    
    } catch(error) {
        throw error;
    }
    return {success: true};
}


export const serviceGetListFriends = async(id: string, prisma: PrismaClient | PrismaTransactionClient) => {
    

    try {
        //Validate the id
        await prisma.user.findUniqueOrThrow({
                where : {id: id},
            });
        const friends = await prisma.user.findMany({
        where: {
            ami: {
                some : {id: id}
            },
        },
    });
        return friends;    
    } catch(error) {
        throw(error);
    }   
};

export const serviceParticipateEvent = async (userId: string, partyId: number, prisma: PrismaClient) => {
    try {
        //Faire une transaction
        await serviceGetUserById(userId, prisma);
        await prisma.$transaction( async(tx) => {
            const soiree = await serviceGetSoireeById(partyId, tx);
            const concurrentParties = await getSoireeInIntervalAndId(soiree.debut, soiree.fin, userId, tx);
            if (concurrentParties.length !== 0) {
                throw new ImpossibleToParticipate(400, partyId, userId);
            }

            await tx.user.update({
                where: {id: userId},
                data : {
                    nombreSoiree : {
                        increment: 1,
                    },
                },
            });
            await tx.soiree.update({
                where : {id: partyId},
                data : {
                    nombreParticipants : {
                        increment: 1,
                    },
                },
            });
            await tx.groupe.create({
                data: {
                    users : {
                        connect : [
                            { id : userId }
                        ]
                    },
                    soiree : {
                        connect : {id: partyId},
                    },
                },
            });
            return;
        });
    } catch (error){
        throw error;
    }

    return {success: true};
}

export const serviceUpdateUser = async (
    id: string,
    data: {
        prenom?: string;
        nom?: string;
        genre?: "HOMME" | "FEMME" | "AUTRE";
        longitude?: number;
        latitude?: number;
    },
    prisma: PrismaClient
) => {
    await serviceGetUserById(id, prisma); 

    return prisma.user.update({
        where: { id },
        data,
    });
};

