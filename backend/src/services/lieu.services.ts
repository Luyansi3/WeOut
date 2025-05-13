import { PrismaClient, Tag } from "@prisma/client";
import PrismaTransactionClient from "@prisma/client";

import { connect } from "http2";
import { userInfo } from "os";
const prisma : PrismaClient = new PrismaClient();




export const serviceGetLieuById = async(id: number) => {
    try {
            return await prisma.lieux.findUnique({
                where: {id},
        });
        } catch(error) {
            throw (error)
        }        
};

export const serviceGetLieux = async (
    isStrictTag: boolean,
    tags: Tag[],
    prisma: PrismaClient | PrismaTransactionClient
) => {
    try {
        return await prisma.lieux.findMany({
            where: {
                ...(tags.length
                    ? {
                        tags: {
                            [isStrictTag ? 'hasEvery' : 'hasSome']: tags,
                        },
                    }
                    : {}),
            },
            include: {
                tags: true,
                soirees: true,
            },
        });
    } catch (error) {
        throw error;
    }
};