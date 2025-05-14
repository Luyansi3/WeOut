import { PrismaClient, Prisma, Tag, TypeLieux } from "@prisma/client";

type PrismaTransactionClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">

import { connect } from "http2";
import { userInfo } from "os";
import { error } from "console";
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

export const serviceGetLieuxFromGooglePlaces = async (type:string,location:number[],radius:number ) => {
//   const types = ['bar', 'night_club', 'cafe'];
    const apiKey = process.env.GOOGLE_API_KEY;
    const locationString = `${location[0]},${location[1]}`;

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${type}&location=${locationString}&radius=${radius}&key=${apiKey}`;
    const response = await fetch(url);
    const data= await response.json();
    return data.results;
};


export const updateLieuGoogleAPI = async(results:any[], type:TypeLieux, prisma:  PrismaClient | PrismaTransactionClient) => {

    try {
        for (const place of results) {
            const nom = place.name;
            const adresse = place.formatted_address;
            const latitude = place.geometry.location.lat;
            const longitude = place.geometry.location.lng;

            let typeLieux: TypeLieux = type; // ou mieux : fais un mapping

            await prisma.lieux.upsert({
                where: { adresse },
                update: { nom, latitude, longitude, type: typeLieux },
                create: { nom, adresse, latitude, longitude, type: typeLieux, tags: [] },
            });
        }


    }
    catch(error){
        throw error;
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
