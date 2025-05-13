import { Request, Response } from "express";
import { PrismaClient, Tag } from "@prisma/client";
import { 
    serviceGetLieuById,
    serviceGetLieux,
 } from "../services/lieu.services"
import { validateTags } from "../utils/tags.utils";


const prisma : PrismaClient = new PrismaClient();

export const getLieuById = async (req: Request, res: Response) => {
    const id : number = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        res.status(400).json({error: 'non valid ID'});
        return;
    }

    try {
        const lieu = await serviceGetLieuById(id);

        if (!lieu) {
            res.status(404).json({error : 'No lieu associated to the ID'});
            return;
        } 
   
        res.status(200).json(lieu);
    } catch(error) {
        res.status(500).json({error : 'Server error'});
    }

    return;
};

export const getLieux = async (req: Request, res: Response) => {
    try {
        const tagsRaw = req.query.tags;
        const isStrictTag = String(req.query.isStrictTag) === 'true';

        const tags = Array.isArray(tagsRaw)
            ? tagsRaw
            : typeof tagsRaw === 'string'
                ? [tagsRaw]
                : [];

        const tagExtracted = validateTags(tags);

        const lieux = await serviceGetLieux(isStrictTag, tagExtracted, prisma);

        res.status(200).json(lieux);
    } catch (error) {
        const message =
            error instanceof Error && error.message ? error.message : 'Server error';
        res.status(500).json({ error: message });
    }
};


