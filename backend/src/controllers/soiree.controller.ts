import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
    serviceGetSoireeById,
    serviceGetSoireeByName,
    serviceGetSoirees,
    getSoireeInIntervalAndId,
    serviceDeleteSoiree,
    serviceGetSoireeByUserId,
    servicePostSoiree,
    serviceUpdateSoiree
 } from "../services/soiree.services"
 import { CustomErrors, BadStateDataBase, DatabaseError, ImpossibleToParticipate } from "../errors/customErrors";
    


const prisma: PrismaClient = new PrismaClient();

export const getSoireeById = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        res.status(400).json({ error: 'non valid ID' });
        return;
    }


    try {
        const soiree = await serviceGetSoireeById(id, prisma);
        if (!soiree) {
            res.status(404).json({ error: 'No soiree associated to the ID' });
            return;
        }

        res.status(200).json(soiree);
    } catch(error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else
            res.status(500).json({error : 'Server error'});
    }
    return;
};

export const getSoireeByName = async (req: Request, res: Response) => {
    const name: string = req.params.name;

    if (!name || typeof name != 'string') {
        res.status(400).json({ error: 'non valid name' });
        return;
    }


    try {
        console.log(name);
        const soirees = await serviceGetSoireeByName(name, prisma);

        res.status(200).json(soirees);
    } catch(error) {
        const message = error instanceof Error && error.message ? error.message : 'Server error';
        res.status(500).json({error:message});
    }

    return;
};

export const getSoirees = async (req: Request, res: Response) => {

    try {
        const active: unknown = req.query.active;
        const now = new Date();
        const soirees = await serviceGetSoirees(now, active, prisma);
        res.status(200).json(soirees)
    }
    catch(error) {
        const message = error instanceof Error && error.message ? error.message : 'Server error';
        res.status(500).json({error:message});
    }
    return;
};

export const postSoiree = async (req: Request, res: Response) => {
    let {
    nom,
    description,
    photoCouverturePath,
    debut,
    fin,
    lieuId,
    organismeId,
    tags,
    } = req.body;

    if (
        typeof nom !== 'string' ||
        typeof description !== 'string' ||
        typeof photoCouverturePath !== 'string' ||
        typeof debut !== 'string' ||
        typeof fin !== 'string' ||
        typeof lieuId !== 'number' ||
        typeof organismeId !== 'string'
        ) {
            res.status(400).json({ error: 'Invalid or missing field(s)' });
        }

    const isArrayOfStrings = (arr: any): arr is string[] => Array.isArray(arr) && arr.every(item => typeof item === 'string');
    const isArrayOfInt = (arr: any): arr is number[] => Array.isArray(arr) && arr.every(item => typeof item === 'number');

    if ((tags !== undefined && !Array.isArray(tags))) {
        res.status(400).json({ error: 'tags must be arrays if provided' });
    }
    debut = new Date(debut);
    fin = new Date(fin);
    try {
        const soirees = await servicePostSoiree(nom,
                                                description,
                                                photoCouverturePath,
                                                debut,
                                                fin,
                                                lieuId,
                                                organismeId,
                                                tags,
                                                prisma
                                            );
        res.status(201).json(soirees)
    }
    catch(error) {
        const message = error instanceof Error && error.message ? error.message : 'Server error';
        res.status(500).json({error:message});
    }
    return;
};

export const deleteSoiree = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid ID format' });
        return;
    }
    try {
        const result = await serviceDeleteSoiree(id, prisma);

        if (!result.success) {
            const statusCode = result.reason === 'Soiree not found' ? 404 : 400;
            res.status(statusCode).json(result);
            return;
        }
        res.status(200).json({ success: true, message: 'Soiree deleted successfully' });
    } catch (error) {
        console.error('Unexpected error in deleteSoiree:', error);
        res.status(500).json({ success: false, reason: 'Server error' });
    }
    return;
};


export const getSoireeByUserId = async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        const result = await serviceGetSoireeByUserId(id, prisma);
        res.status(200).json(result);
    } catch (error) {
        if (error instanceof CustomErrors)
            res.status(error.statusCode).json(error);
        else
            res.status(500).json({error : 'Server error'});
    }
}
export const putSoiree = async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid ID' });
        return;
    }

    const {
        nom,
        description,
        photoCouverturePath,
        debut,
        fin,
        lieuId,
        organismeId,
        tags
    } = req.body;

    try {
        const updated = await serviceUpdateSoiree(id, {
            nom,
            description,
            photoCouverturePath,
            debut: debut ? new Date(debut) : undefined,
            fin: fin ? new Date(fin) : undefined,
            lieuId,
            organismeId,
            tags,
            
        },prisma);

        if (!updated) {
            res.status(404).json({ error: 'Soiree not found' });
            return;
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

