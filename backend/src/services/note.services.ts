import { PrismaClient, Prisma, Tag } from "@prisma/client";
import { serviceGetSoireeById } from "./soiree.services"
import { DatabaseError } from "../errors/customErrors";

type PrismaTransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">




export const serviceGetNoteLive = async (eventId : number, prisma : PrismaClient | PrismaTransactionClient) : Promise<number | null> => {
    const now = new Date();
    const validtyDate = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    

    try {
        await serviceGetSoireeById(eventId, prisma);

        const notePerUser = await prisma.note.groupBy({
            by: ['userId'],
            _max : {updatedAt : true},
            where : {
                updatedAt : {
                    gte : validtyDate
                },
            },       
        });
        if (!notePerUser) return null;
        

        const average = await prisma.note.aggregate({
            where : {
                OR: notePerUser
                        .filter((user) => user._max.updatedAt !== null && user._max.updatedAt !== undefined)
                        .map(({ userId, _max}) => ({
                            userId,
                            updatedAt: _max.updatedAt as Date,
                        })),
            },
            _avg : {note : true},
        });

        return average._avg.note;
    } catch(error) {
        throw error;
    }
}


export const serviceGetNoteDef = async (eventId: number, prisma: PrismaClient | PrismaTransactionClient) :  Promise<number | null> => {
    try {
        await serviceGetSoireeById(eventId, prisma);

        const avgOfAvg = await prisma.note.groupBy({
            by : ['userId'],
            _avg : { note: true },
        });

        if (!avgOfAvg) return null;

        const result = avgOfAvg
            .map(group => group._avg.note)
            .filter((note) : note is number => note !== null && note !== undefined)
            .reduce((acc, val) => acc + val, 0) / avgOfAvg.length;

        return result;
    } catch (error) {
        throw error;
    }
}


export const servicePostNote = async (
    userId: string,
    soireeId: number,
    note: number,
    prisma: PrismaClient | PrismaTransactionClient
) => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    try {
        const recentNote = await prisma.note.findFirst({
            where: {
                userId,
                soireeId,
                createdAt: {
                    gte: oneHourAgo,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        let newNote;
        if (recentNote) {
            newNote = await prisma.note.update({
                where : {id: recentNote.id},
                data: {
                    userId,
                    soireeId,
                    note,
                },
            });
        } else {
            newNote = await prisma.note.create({
                data: {
                    userId,
                    soireeId,
                    note,
                },
            });
        }

        

        return newNote;
    } catch (error) {
        throw error;
    }
};

