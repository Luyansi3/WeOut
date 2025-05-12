import {PrismaClient} from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();


export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export const createUser = async (hashedMdp: string, email: string, prenom: string, nom: string) => {
    try {
        await prisma.$transaction( async(tx) => {
            const compte = await tx.compte.create({
                data: {
                    hashedMdp: hashedMdp,
                    email: email,
                },
            });
            await tx.user.create({
                data: {
                    prenom: prenom,
                    nom: nom,
                    genre: "HOMME",
                    compteId: compte.id,
                    longitude: Math.random() * 100.5,
                    latitude: Math.random() * 100.5,
                },
            });
        });
    } catch (error) {
        throw (error);
    }
};


export const makeUsersFriends = async (id1: string, id2: string) => {
    try {
        await prisma.$transaction([
            prisma.user.update({
                where: {id : id1},
                data: {
                    ami: {
                        connect: {id : id2},
                    },
                },
            }),
            prisma.user.update({
                where: {id : id2},
                data: {
                    ami: {
                        connect: {id : id1},
                    },
                },
            }),
        ]);
    } catch(error) {
        throw(error);
    }
};


export const sendRequest = async (sender: string, receiver:string) => {
    try {
        await prisma.$transaction([
            prisma.user.update({
                where: {id : sender},
                data: {
                    demandeEnvoye: {
                        connect: {id : receiver},
                    },
                },
            }),
            prisma.user.update({
                where: {id : receiver},
                data: {
                    demandeRecue: {
                        connect: {id : sender},
                    },
                },
            }),
        ]);
    } catch(error) {
        throw(error);
    }
};


export const createMultipleUsersRandomly = (iterations: number) => {
    for(let i = 0; i<iterations; i++) {
        createUser(generateRandomString(10), generateRandomString(10) + "@" + generateRandomString(5), generateRandomString(5), generateRandomString(7));
    }
};


export const createSoiree = async (nom: string, description: string, start: Date, end: Date) => {
    try {
        await prisma.soiree.create({
            data: {
                nom: nom,
                description: description,
                debut: start,
                fin: end, 
            },
        });
    } catch(error) {
        throw(error);
    }
}


export const createMultiplePartiesRandomly = (iterations: number) => {
    for(let i =0; i<iterations; i++) {
        createSoiree(generateRandomString(5), generateRandomString(30), new Date(), new Date(new Date().setDate(new Date().getDate() + 1)));
    }
}