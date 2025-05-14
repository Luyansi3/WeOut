import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { 
    serviceSendFriendRequest,
    serviceDeclineFriendRequest,
    serviceAcceptFriendRequest,
    serviceGetUserById,
    serviceGetListFriends,
    serviceParticipateEvent,
    serviceUpdateUserInfo,
    serviceSignupUser,
    serviceCheckFriendshipStatus,
    serviceSigninUser,
    serviceGetMeUser,
    serviceUnsubscribreEvent,
    serviceIsSubscribed,
    serviceGetSoireeRecommendations
 } from "../services/user.services"
import { z } from 'zod';
import { CustomErrors, BadStateDataBase, DatabaseError } from "../errors/customErrors";
import { flushCompileCache } from "module";
import { error } from "console";


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
        else if (error instanceof Error)
            res.status(500).json({error : 'Server error', message : error.message});
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
        else if (error instanceof Error)
            res.status(500).json({error : 'Server error', message : error.message});
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


const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupUser = async (req: Request, res: Response) => {
    let {firstname, lastname, username, password, email} = req.body;
    if(typeof firstname !== 'string' ||
        typeof lastname !== 'string' ||
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        typeof email !== 'string'){
        res.status(400).json({error:'Invalid or missing field(s)'});
        return;
    }
    const result = signupSchema.safeParse({email, password});
    if(!result.success){
        res.status(400).json({error: result.error.format()});
        return;
    }


    try {

        const {compteCreated, user} = await serviceSignupUser({firstname, lastname, username, email, password}, prisma);
        res.status(201).json(user);
    } catch (error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json({error: error.message});
        else if (error instanceof Error)
            res.status(500).json({ error: "Server error", message: error.message});
    }
};



export const checkFriendshipStatus = async(req: Request, res: Response) => {
    const activeId : string = req.params.id;
    const passiveIdRaw = req.query.id;

    if (!passiveIdRaw || typeof passiveIdRaw !== 'string') {
        res.status(400).json({error: 'Bad id for the passive User'});
        return;
    } const passiveId : string = passiveIdRaw;

    try {
        const result = await serviceCheckFriendshipStatus(activeId, passiveIdRaw, prisma);
        res.status(200).json(result);}
    catch (error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json({error: error.message});
        else if (error instanceof Error)
            res.status(500).json({ error: "Server error", message: error.message});
    }
};

export const signinUser = async (req: Request, res: Response) => {
    let {email, password} = req.body;
    if(typeof email !== 'string' ||
        typeof password !== 'string'){
        res.status(400).json({error:'Invalid or missing field(s)'});
        return;
    }

    try {
        const token = await serviceSigninUser({email, password}, prisma);
        res.status(201).json({token});
    } catch (error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json({error: error.message});
        else if (error instanceof Error)
            res.status(500).json({ error: "Server error", message: error.message});
    }
};

export const getMeUser = async (req: Request, res: Response) => {
    const id : string = (req as any).userId;
    if (!id) {
        res.status(401).json({ message: 'Permission denied' });
        return;
    }
    try {
        const user = await serviceGetMeUser(id, prisma);
        res.status(200).json(user);

    } catch (error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else if (error instanceof Error)
            res.status(500).json({error : 'Server error', message: error.message});
    }    

    return;
};

export const signoutUser = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Déconnexion réussie' });
}


export const unsubscribeEvent = async(req: Request, res: Response) => {
    const userId : string = req.params.id;
    const partyIdRaw  = req.query.id;

    if (!partyIdRaw || typeof partyIdRaw !== 'string'){
        res.status(400).json({error: 'bad partyId format'});
        return;
    }
    const partyIdString : string = partyIdRaw;
    const partyId : number = parseInt(partyIdString, 10);


    try {
        const result = await serviceUnsubscribreEvent(userId, partyId, prisma);
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else if (error instanceof Error)
            res.status(500).json({error : 'Server error', message : error.message});
    }
};


export const isSubscribed = async(req: Request, res: Response) => {
    const userId : string = req.params.id;
    const partyIdRaw  = req.query.id;

    if (!partyIdRaw || typeof partyIdRaw !== 'string'){
        res.status(400).json({error: 'bad partyId format'});
        return;
    }
    const partyIdString : string = partyIdRaw;
    const partyId : number = parseInt(partyIdString, 10);

    try {
        const result : boolean = await serviceIsSubscribed(userId, partyId, prisma);
        res.status(200).json({result: result});
    } catch (error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else if (error instanceof Error)
            res.status(500).json({error : 'Server error', message : error.message});
    }
}

export const getSoireeRecommendations = async (req: Request, res: Response) => {
    const userId = req.params.userId;
  
    if (!userId || typeof userId !== 'string') {
      res.status(400).json({
        success: false,
        reason: 'Missing or invalid userId',
      });
      return;
    }
    try {
      const result = await serviceGetSoireeRecommendations(userId, prisma);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof CustomErrors) {
        res.status(error.statusCode).json({
          success: false,
          reason: error.message,
        });
      } else {
        console.error('Unexpected error in getSoireeRecommendations:', error);
        res.status(500).json({
          success: false,
          reason: 'Server error',
        });
      }
    }
  };
  
