import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const getUserById = async (req: Request, res: Response) => {
    const id : string = req.params.id;

    if (!id || typeof id != 'string') {
        res.status(400).json({error: 'non valid ID'});
        return;
    }
        

    try {
        const user = await prisma.user.findUnique({
            where: {id},
        });

        if (!user) {
            res.status(404).json({error : 'No user associated to the ID'});
            return;
        } 

        res.json(user);
    } catch(error) {
        res.status(500).json({error : 'Server error'});
    }

    return;
};