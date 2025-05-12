import { PrismaClient, Prisma } from "@prisma/client";
import { DatabaseError, BadStateDataBase, ImpossibleToParticipate } from "../errors/customErrors";
import { getSoireeById } from "../controllers/soiree.controller";
import { serviceGetSoireeById } from "./soiree.services";

type PrismaTransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">


export const serviceGetOrgaById = async (id: string, prisma: PrismaClient | PrismaTransactionClient) => {
    try {
        return await prisma.organisme.findUniqueOrThrow({
            where : {
                id: id,
            },
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') 
            throw new DatabaseError(id, "Organisme", 404);
        else 
            throw error;
    }
}


export const serviceGetOrgaBySoireeId = async (id: number, prisma: PrismaClient | PrismaTransactionClient) => {
    try {
        await serviceGetSoireeById(id, prisma);
        const result = await prisma.soiree.findUniqueOrThrow({
            where : {
                id: id
            },
            select : {
                organsime : true,
            },
        });
        return result;
    }catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') 
            throw new DatabaseError(id, "Soiree", 404);
        else 
            throw error;
    }
}