import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { serviceIsSoireeNow } from "../services/soiree.services";
import { serviceGetNoteDef, serviceGetNoteLive, servicePostNote } from "../services/note.services";
import { serviceGetSoireeParticipants } from "../services/soiree.services";
import { CustomErrors } from "../errors/customErrors";
import { serviceIsSubscribed } from "../services/user.services";

const prisma : PrismaClient = new PrismaClient();



export const getNoteSoiree = async (req: Request, res: Response) => {
    const partyIdString : string = req.params.id;

    
    const partyId : number = parseInt(partyIdString, 10);

    try {
        const result = (await serviceIsSoireeNow(partyId, prisma) ? await serviceGetNoteLive(partyId, prisma) : await serviceGetNoteDef(partyId, prisma));
        res.status(200).json(result);
    } catch (error)  {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else if (error instanceof Error)
            res.status(500).json({error : 'Server error', message : error.message});
    }
}


export const postNote = async (req: Request, res: Response) => {
    const { userId, note } = req.body;
    const soireeId = parseInt(req.body.soireeId, 10);

    if (!userId || isNaN(soireeId) || note === undefined) {
        res.status(400).json({ error: "Champs requis manquants" });
        return;
    }

    try {
        // Vérifier si la soirée est en cours
        const isLive = await serviceIsSoireeNow(soireeId, prisma);
        if (!isLive) {
            res.status(403).json({ error: "La soirée n'est pas en cours." });
            return;
        }

        // Vérifier si l'utilisateur participe à la soirée
        const doesParticipate = serviceIsSubscribed(userId, soireeId, prisma);

        if (!doesParticipate) {
            res.status(400).json({error: "Le user ne participe pas à la soirée"});
        }        

        // Ajouter la note
        const createdNote = await servicePostNote(userId, soireeId, note, prisma);
        res.status(201).json(createdNote);

    } catch (error) {
        console.error(error);
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else
            res.status(500).json({ error: "Erreur serveur", message: error instanceof Error ? error.message : undefined });
    }
};




export const getLatestNote = async (req: Request, res: Response) => {
    const userIdRaw = req.query.userId;
    const eventIdRaw = req.params.eventId;

    if (!userIdRaw || typeof userIdRaw !== 'string') {
        res.status(400).json({error: 'Bad arguments for user Id'});
    }
    const eventId : number = parseInt(eventIdRaw, 10);



}
