import { Request, Response } from "express";
import { PrismaClient, Tag } from "@prisma/client";
import { 
    serviceGetLieuById,
    serviceGetLieux,
 } from "../services/lieu.services"


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
        const { tags } = req.body;
        const isStrictTagRaw = req.query.isStrictTag;

        // Validation du paramètre isStrictTag
        if (
            !isStrictTagRaw ||
            typeof isStrictTagRaw !== 'string' ||
            (isStrictTagRaw !== 'true' && isStrictTagRaw !== 'false')
        ) {
            res.status(400).json({ error: 'Invalid boolean for isStrictTag' });
            return;
        }

        const isStrictTag = isStrictTagRaw === 'true';
        const tagExtracted = validateTags(tags); // Doit retourner un tableau de Tag valides

        const lieux = await serviceGetLieux(isStrictTag, tagExtracted, prisma);

        res.status(200).json(lieux);
    } catch (error) {
        const message =
            error instanceof Error && error.message ? error.message : 'Server error';
        res.status(500).json({ error: message });
    }
};

