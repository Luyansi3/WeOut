// controllers/soiree.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSoirees = async (req: Request, res: Response) => {
    try {
        const soirees = await prisma.soiree.findMany();


        res.status(200).json(soirees);
    } catch (error) {
        console.error('Erreur lors de la récupération des soirées :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }

    return;
};
