import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { serviceSendFriendRequest } from "../services/user.services"


const prisma : PrismaClient = new PrismaClient();

export const getUserById = async (req: Request, res: Response) => {
    const id : string = req.params.id;

    if (!id || typeof id != 'string') {
        res.status(400).json({error: 'non valid ID'});
        return;
    }
        

    try {
        const user = await prisma.user.findUnique({
            where: {id},
        });

        if (!user) {
            res.status(404).json({error : 'No user associated to the ID'});
            return;
        } 

        res.status(200).json(user);
    } catch(error) {
        res.status(500).json({error : 'Server error'});
    }

    return;
};



export const sendFriendRequest = async (req: Request, res: Response) => {
    const senderId : string = req.params.id;
    const receiverIdRaw = req.query.receiverId;

    //Verify the senderId is valid
    if (!senderId || typeof senderId != 'string') {
        res.status(400).json({error: 'non valid sender ID'});
        return;
    }
    //Verify the receiverId is valid
    if (typeof receiverIdRaw != 'string') {
        res.status(400).json({error : 'non valid receiver ID'});
        return;
    }
    const receiverId : string= receiverIdRaw;

    if (receiverId==senderId) {
        res.status(400).json({error: 'the sender and receiver Id can\'t be the sames'});
        return;
    }


    try {
        const result = await serviceSendFriendRequest(senderId, receiverId);
        if (result.success)
            res.status(200);
        else
            res.status(400).json(result);
    }
    catch(error) {
        res.status(500).json({error : 'Server error'});
    }
    return;
};