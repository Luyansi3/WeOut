import { PrismaClient, Prisma, Tag } from "@prisma/client";
import { DatabaseError, BadStateDataBase, CustomErrors, ImpossibleToParticipate } from "../errors/customErrors";
import { serviceGetUserById } from "./user.services";
import {validateTags} from "../utils/tags.utils"
type PrismaTransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">

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
            
        });
    } catch (error) {
        throw error;
    }
};
