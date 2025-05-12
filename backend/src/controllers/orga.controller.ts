import { PrismaClient, Prisma } from "@prisma/client";
import { DatabaseError, BadStateDataBase, ImpossibleToParticipate, CustomErrors } from "../errors/customErrors";
import { Request, Response } from "express";
import { serviceGetOrgaBySoireeId } from "../services/orga.services";


const prisma : PrismaClient = new PrismaClient();

export const getOrgaBySoireeId = async (req: Request, res: Response) => {
    const id : number = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        res.status(400).json({error: 'non valid ID'});
        return;
    }

    try {
        const orga = await serviceGetOrgaBySoireeId(id, prisma);
        res.status(200).json(orga);
    } catch(error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else
            res.status(500).json({error : 'Server error'});
    }

    return;
}