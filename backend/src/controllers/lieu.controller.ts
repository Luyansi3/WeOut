import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { 
    serviceGetLieuById
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

