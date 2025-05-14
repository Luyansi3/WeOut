import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { serviceIsSoireeNow } from "../services/soiree.services";
import { serviceGetNoteDef, serviceGetNoteLive, servicePostNote } from "../services/note.services";
import { CustomErrors } from "../errors/customErrors";

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
    const { userId, soireeId, note } = req.body;

    if (!userId || soireeId === undefined || note === undefined) {
        res.status(400).json({ error: "Champs requis manquants" });
        return;
    }

    try {
        const createdNote = await servicePostNote(userId, soireeId, note, prisma);
        res.status(201).json(createdNote);
    } catch (error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else res.status(500).json({ error: "Erreur serveur" });
    }
};

