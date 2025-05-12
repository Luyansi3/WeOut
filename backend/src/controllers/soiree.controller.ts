import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { 
    serviceGetSoireeById,
    serviceGetSoireeByName,
    serviceGetSoirees,
 } from "../services/soiree.services"


const prisma : PrismaClient = new PrismaClient();

export const getSoireeById = async (req: Request, res: Response) => {
    const id : number = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        res.status(400).json({error: 'non valid ID'});
        return;
    }
        

    try {
        const soiree = await serviceGetSoireeById(id);
        if (!soiree) {
            res.status(404).json({error : 'No soiree associated to the ID'});
            return;
        } 

        res.status(200).json(soiree);
    } catch(error) {
        res.status(500).json({error : 'Server error'});
    }

    return;
};

export const getSoireeByName = async (req: Request, res: Response) => {
    const name : string = req.params.name;

    if (!name || typeof name != 'string') {
        res.status(400).json({error: 'non valid name'});
        return;
    }
        

    try {
        console.log(name);
        const soirees = await serviceGetSoireeByName(name);

        res.status(200).json(soirees);
    } catch(error) {
        res.status(500).json({error : 'Server error'});
    }

    return;
};

export const getSoirees = async (req: Request, res: Response) => {

    try {
        const active = req.query.active;
        const now = new Date();
        const soirees = await serviceGetSoirees(now, active);
        res.status(200).json(soirees)
    }
    catch(error) {
        res.status(500).json({error : 'Server error'});
    }
    return;
};