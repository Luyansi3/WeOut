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


export const serviceGetSoirees = async(now: Date, active:any) => {
    try {
        return await prisma.soiree.findMany({
            where: active === 'true' ? { fin: { gt: now } } : {},
        });
    } catch(error) {
        throw (error)
    }
};