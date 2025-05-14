import { Request, Response } from "express";
import { PrismaClient, Tag, TypeLieux } from "@prisma/client";
import { 
    serviceGetLieuById,
    serviceGetLieux,
    updateLieuGoogleAPI,
    serviceGetLieuxFromGooglePlaces
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


        const tagsRaw = req.body.tags;
        const isStrictTag = req.body.isStrictTag;
        const location = req.body.location;
        const radius = req.body.radius;

        const tags = Array.isArray(tagsRaw)
            ? tagsRaw
            : typeof tagsRaw === 'string'
                ? [tagsRaw]
                : [];

        const tagExtracted: Tag[] = validateTags(tags);
        if (typeof isStrictTag !== 'boolean') {
            res.status(400).json({error: "Invalid boolean for isStrictTag"});
            return;
        }
        if (!Array.isArray(location) || location.length !== 2 || typeof location[0] !== 'number' || typeof location[1] !== 'number'
        ) {
            res.status(400).json({error: "Invalid array of numbers for location"});
            return;
        }
        if (typeof radius !== 'number') {
            res.status(400).json({error: "Invalid number for radius"});
            return;
        }

        const typesLieu = Object.values(TypeLieux);
        for(const type of typesLieu){
            const results = await serviceGetLieuxFromGooglePlaces(type.toLowerCase(), location, radius);
            await updateLieuGoogleAPI(results, type as TypeLieux, prisma);
        }
        const results = await serviceGetLieuxFromGooglePlaces('night_club', location, radius);
        await updateLieuGoogleAPI(results, "BOITE" as TypeLieux, prisma);



        const lieux = await serviceGetLieux(isStrictTag, tagExtracted, prisma);

        res.status(200).json(lieux);
    } catch (error) {
        const message =
            error instanceof Error && error.message ? error.message : 'Server error';
        res.status(500).json({ error: message });
    }
};


