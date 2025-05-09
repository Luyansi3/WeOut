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
    const relationStatus: FriendshipStatus = await checkFriendshipStatus(senderId, receiverId);

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

