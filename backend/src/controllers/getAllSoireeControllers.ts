// services/service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSoirees = async () => {
    return await prisma.soiree.findMany({
        include: {
            lieu: true,
            organsime: true,
            tags: true,
            groupes: true,
            photos: true,
            commentaires: true,
        },
    });
};
