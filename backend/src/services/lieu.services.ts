import { PrismaClient, Tag } from "@prisma/client";
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

export const serviceGetAllLieux = async (tagArray: Tag[], dateFilter?: Date) => {
    try {
        return await prisma.lieux.findMany({
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
                                    debut: { lte: dateFilter },
                                    fin: { gte: dateFilter },
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
    } catch (error) {
        throw error;
    }
};