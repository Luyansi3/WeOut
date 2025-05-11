import { PrismaClient } from "@prisma/client";
import { connect } from "http2";
const prisma : PrismaClient = new PrismaClient();



//Todo, defin hierarchy and rules
type FriendshipStatus =
  | 'already_sent'
  | 'already_received'
  | 'already_friends'
  | 'blocked'
  | 'blocked_by'
  | 'no_relation'
  | 'non_valid_status'
  | null;
  

const checkFriendshipStatus = async (senderId: string, receiverId: string) : Promise<FriendshipStatus> => {
    //Get the sener (or active person)
    const sender = await prisma.user.findUnique({
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
    const receiver = await prisma.user.findUnique({
        where : {id: receiverId},
        include: {
            demandeRecue : true,
            demandeEnvoye : true,
            bloque : true,
            bloquant : true,
            ami : true
        },
    });

    //Check for null
    if (!sender || !receiver)
        return null;

    //Voir toutes les configurations possibles
    const hasSent = sender.demandeEnvoye.some((user : any)=> user.id == receiverId);
    const hasReceived = sender.demandeRecue.some((user : any) => user.id == receiverId);
    const hasBlocked = sender.bloque.some((user: any)=> user.id == receiverId);
    const isBlocked = sender.bloquant.some((user: any)=> user.id == receiverId);
    const isFriend = sender.bloquant.some((user: any) => user.id == receiverId);


    //Voir toutes les configuration possibles mais à l'envers
    const hasSentReverse = receiver.demandeEnvoye.some((user : any)=> user.id == senderId);
    const hasReceivedReverse = receiver.demandeRecue.some((user : any) => user.id == senderId);
    const hasBlockedReverse = receiver.bloque.some((user: any)=> user.id == senderId);
    const isBlockedReverse = receiver.bloquant.some((user: any)=> user.id == senderId);
    const isFriendReverse = receiver.bloquant.some((user: any) => user.id == senderId);


    //En fonction des ocnfigurations, voir le statut
    if ((hasSent && hasReceived)
        || (hasReceivedReverse && hasSentReverse)
        || (isFriend != isFriendReverse)
        || (isFriend && (hasReceived || hasSent))
        || (isFriendReverse && (hasReceivedReverse || hasSentReverse))
    )
        return 'non_valid_status'

    if (hasBlocked && isBlockedReverse)
        return 'blocked';
    if (isBlocked && hasBlockedReverse)
        return 'blocked_by'
    if (isFriend && isBlockedReverse)
        return 'already_friends'
    if (hasSent && hasReceivedReverse)
        return 'already_sent'
    if (hasReceived && hasSentReverse)
        return 'already_received'

    return 'no_relation'

}


export const serviceSendFriendRequest = async (senderId: string, receiverId: string) => {
    //Get the status of the relationship
    const relationStatus: FriendshipStatus = await checkFriendshipStatus(senderId, receiverId);


    //Regarding the status, return all the errors possible
    if (!relationStatus)
        return {success: false, reason: 'invalid IDs'};
    if (relationStatus == 'non_valid_status')
        return {success: false, reason: 'invalid database'};
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



export const serviceDeclineFriendRequest =  async(senderId: string, receiverId: string) => {
    //Get the status of the relationship
    const relationStatus: FriendshipStatus = await checkFriendshipStatus(senderId, receiverId);


    //Regarding the status, return all the errors possible
    if (!relationStatus)
        return {success: false, reason: 'invalid IDs'};
    if (relationStatus == 'non_valid_status')
        return {success: false, reason: 'invalid database'};
    if (relationStatus == 'blocked' || relationStatus == 'blocked_by')
        return {success: false, reason: 'someone is blocked'};
    if (relationStatus == 'already_friends')
        return {success: false, reason: 'already friends'};
    if (relationStatus == 'already_sent')
        return {success: false, reason: 'friend request sent and not received'};

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

