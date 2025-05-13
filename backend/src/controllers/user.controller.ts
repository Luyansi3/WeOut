import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { 
    serviceSendFriendRequest,
    serviceDeclineFriendRequest,
    serviceAcceptFriendRequest,
    serviceGetUserById,
    serviceGetListFriends,
    serviceParticipateEvent,
    serviceUpdateUserInfo
 } from "../services/user.services"

 import { CustomErrors, BadStateDataBase, DatabaseError } from "../errors/customErrors";


const prisma : PrismaClient = new PrismaClient();

export const getUserById = async (req: Request, res: Response) => {
    const id : string = req.params.id;

    if (!id || typeof id != 'string') {
        res.status(400).json({error: 'non valid ID'});
        return;
    }

    try {
        const user = await serviceGetUserById(id, prisma);
        res.status(200).json(user);

    } catch (error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else
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
    if (!receiverIdRaw ||typeof receiverIdRaw != 'string') {
        res.status(400).json({error : 'non valid receiver ID'});
        return;
    }
    const receiverId : string= receiverIdRaw;

    if (receiverId==senderId) {
        res.status(400).json({error: 'the sender and receiver Id can\'t be the sames'});
        return;
    }


    try {
        const result = await serviceSendFriendRequest(senderId, receiverId, prisma);
        if (result.success)
            res.status(201).json(result);
        else
            res.status(400).json(result);
    }
    catch(error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else
            res.status(500).json({error : 'Server error'});
    }
    return;
};



export const declineFriendRequest = async(req: Request, res: Response) => {
    const receiverId : string = req.params.id;
    const senderIdRaw = req.query.senderId;

    //Verify the senderId is valid
    if (!senderIdRaw || typeof senderIdRaw != 'string') {
        res.status(400).json({ error: 'the sender id is not valid'});
        return;
    }
    const senderId : string = senderIdRaw;

    if (receiverId==senderId) {
        res.status(400).json({error: 'the sender and receiver Id can\'t be the sames'});
        return;
    }

    try {
        const result = await serviceDeclineFriendRequest(senderId, receiverId, prisma);
        if (result.success)
            res.status(201).json(result);
        else
            res.status(400).json(result);
        
    } catch(error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else
            res.status(500).json({error : 'Server error'});
    }

    return;
};



export const acceptFriendRequest = async (req: Request, res: Response) => {
    const receiverId : string = req.params.id;
    const senderIdRaw = req.query.senderId;

    //Verify the senderId is valid
    if (!senderIdRaw || typeof senderIdRaw != 'string') {
        res.status(400).json({ error: 'the sender id is not valid'});
        return;
    }
    const senderId : string = senderIdRaw;

    if (receiverId==senderId) {
        res.status(400).json({error: 'the sender and receiver Id can\'t be the sames'});
        return;
    }

    try {
        const result = await serviceAcceptFriendRequest(senderId, receiverId, prisma);
        if (result.success) {
            res.status(201);
        } else {
            res.status(400);
        }
        res.json(result);
    } catch (error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else
            res.status(500).json({error : 'Server error'});
    }
};


export const getListFriends = async (req: Request, res: Response) => {
    const id : string = req.params.id;

    try {

        const friends = await serviceGetListFriends(id, prisma);
        res.status(200).json(friends);
        
    } catch(error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else
            res.status(500).json({error : 'Server error'});
    }
};


export const participateEvent = async (req: Request, res: Response) => {
    const userId : string = req.params.id;
    const partyIdRaw = req.query.partyId;

    if (!partyIdRaw || typeof partyIdRaw != 'string') {
        res.status(400).json('non valid party id');
        return;
    }
    const partyId : number = parseInt(partyIdRaw, 10);


    try {
        const result = await serviceParticipateEvent(userId, partyId, prisma);
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else
            res.status(500).json({error : 'Server error'});
    }
    
}

export const updateUserInfo = async (req: Request, res: Response) => {
    const userId: string = req.params.id;
    const updateData = req.body;
  
    try {
      const result = await serviceUpdateUserInfo(userId, updateData, prisma);
  
      if (!result.success) {
        const statusCode =
          'reason' in result && result.reason === 'Validation failed' ? 400 :
          'reason' in result && result.reason === 'User not found' ? 404 :
          500;
  
        res.status(statusCode).json(result);
        return ;
      }
        res.status(200).json(result);
      return ;
    } catch (error) {
      if (error instanceof CustomErrors) {
         res.status(error.statusCode).json({ error: error.message });
         return;
      }
  
      console.error('Unexpected error in updateUserInfo:', error);
       res.status(500).json({ error: 'Server error' });
       return;
    }
  };
<<<<<<< HEAD
=======

>>>>>>> ad86a1a (fixed redef of updateUser)
