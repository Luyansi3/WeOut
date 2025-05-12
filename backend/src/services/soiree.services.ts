import { PrismaClient } from "@prisma/client";
import { connect } from "http2";
import { userInfo } from "os";
const prisma : PrismaClient = new PrismaClient();



export const serviceGetSoireeById = async(id: number) => {
    try {
            return await prisma.soiree.findUnique({
            where: {id},
            });
        } catch(error) {
            throw (error)
        }
};


export const serviceGetSoireeByName = async(name: string) => {
    try {
        return await prisma.soiree.findMany({
            where: {
                nom: {equals: name,},
            }
        });
    } catch(error) {
        throw (error)
    }
};


export const serviceGetSoirees = async(now: Date, active:unknown) => {
    try {
        return await prisma.soiree.findMany({
            where: active === 'true' ? { fin: { gt: now } } : {},
        });
    } catch(error) {
        throw (error)
    }
};

export const serviceDeleteSoiree = async (soireeId: number) => {
    if (!soireeId || isNaN(soireeId)) {
        return { success: false, reason: "Invalid or missing soiree ID" };
    }

    try {
        const existingSoiree = await prisma.soiree.findUnique({
            where: { id: soireeId },
        });

        if (!existingSoiree) {
            return { success: false, reason: "Soiree not found" };
        }

        await prisma.soiree.delete({
            where: { id: soireeId },
        });

        return { success: true, message: "Soiree deleted successfully" };
    } catch (error) {
        console.error("Error deleting soiree:", error);
        return { success: false, reason: "Database error", error };
    }
};