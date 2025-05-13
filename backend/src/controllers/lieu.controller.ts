import { Request, Response } from "express";
import { PrismaClient, Tag } from "@prisma/client";
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


export const getAllLieux = async (req: Request, res: Response) => {
    try {
        const { tags, date } = req.query;

        // Filtrage par tags
        const tagArray: Tag[] = tags
            ? (String(tags)
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => Object.values(Tag).includes(tag as Tag)) as Tag[])
            : [];

        // Filtrage par date (soiree active à ce moment-là)
        const dateFilter = date ? new Date(String(date)) : null;

        const lieux = await prisma.lieux.findMany({
            where: {
                AND: [
                    tagArray.length > 0
                        ? {
                            tags: {
                                hasSome: tagArray,
                            },
                        }
                        : {},

                    dateFilter
                        ? {
                            soirees: {
                                some: {
                                    debut: {
                                        lte: dateFilter,
                                    },
                                    fin: {
                                        gte: dateFilter,
                                    },
                                },
                            },
                        }
                        : {},
                ],
            },
            include: {
                tags: true,
                soirees: true,
            },
        });

        res.status(200).json(lieux);
    } catch (error) {
        console.error('Error in getAllLieux:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

