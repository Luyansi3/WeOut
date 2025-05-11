import {PrismaClient} from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();


function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}

const createUser = async (hashedMdp: string, email: string, prenom: string, nom: string) => {
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


const createMultipleUsers = (iterations: number) => {
    for(let i = 0; i<iterations; i++) {
        createUser(generateRandomString(10), generateRandomString(10) + "@" + generateRandomString(5), generateRandomString(5), generateRandomString(7));
    }
}


createMultipleUsers(20);