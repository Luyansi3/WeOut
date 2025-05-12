import { PrismaClient } from "@prisma/client";
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


