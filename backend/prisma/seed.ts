import {PrismaClient, Tag, TypeLieux} from "@prisma/client";

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

export const createUser = async (hashedMdp: string, email: string, prenom: string, nom: string, pseudo: string) => {
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
                    pseudo: pseudo,
                    prenom: prenom,
                    nom: nom,
                    genre: "HOMME",
                    compteId: compte.id,
                    longitude: Math.random() * 100.5,
                    latitude: Math.random() * 100.5,
                    alcohool: Math.floor(Math.random() * 101),
                    dancing: Math.floor(Math.random() * 101),
                    talking: Math.floor(Math.random() * 101),
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
        createUser(generateRandomString(10), generateRandomString(10) + "@" + generateRandomString(5), generateRandomString(5), generateRandomString(7), generateRandomString(5));
    }
};

export const createEvent = async ({
  nom,
  description,
  photoCouverturePath,
  debut,
  fin,
  lieuId,
}: {
  nom: string;
  description: string;
  photoCouverturePath: string;
  debut: Date;
  fin: Date;
  lieuId: number;
}) => {
  try {
    const soiree = await prisma.soiree.create({
      data: {
        nom,
        description,
        photoCouverturePath,
        debut,
        fin,
        lieu: {
          connect: { id: lieuId },
        },
      },
    });
    return soiree;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Function to create a Lieu
export const createLieu = async (lieuData: {
  nom: string;
  type: 'BOITE' | 'BAR' | 'BARDANSANT' | 'CAFE'; // Enum TypeLieux
  adresse: string;
  longitude: number;
  latitude: number;
}) => {
  try {
    const createdLieu = await prisma.lieux.create({
      data: {
        nom: lieuData.nom,
        type: lieuData.type,
        adresse: lieuData.adresse,
        longitude: lieuData.longitude,
        latitude: lieuData.latitude,
        tags: [] as Tag[]
      },
    });

    console.log('Lieu created:', createdLieu);
    return createdLieu;
  } catch (error) {
    console.error('Error creating Lieu:', error);
    throw error;
  }
};

// Function to create an Organisme
export const createOrganisme = async (organismeData: {
  nom: string;
  note: number;
  compteId: string;
  photo: string;
}) => {
  try {
    const createdOrganisme = await prisma.organisme.create({
      data: {
        nom: organismeData.nom,
        compteId: organismeData.compteId,
        note: organismeData.note,
        photo: organismeData.photo
      },
    });

    console.log('Organisme created:', createdOrganisme);
    return createdOrganisme;
  } catch (error) {
    console.error('Error creating Organisme:', error);
    throw error;
  }
};

export const createEventWithLieuAndOrganisme = async ({
  nomEvent,
  descriptionEvent,
  photoCouverturePath,
  debut,
  fin,
  compteData,  // Contains all data for the Compte
  lieuData,  // Contains all data for the Lieu
  organismeData,  // Contains all data for the Organisme
}: {
  nomEvent: string;
  descriptionEvent: string;
  photoCouverturePath: string;
  debut: Date;
  fin: Date;
  compteData: {
    hashedMdp: string;  // Hashed password for the compte
    email: string;  // Email associated with the compte
  };
  lieuData: {
    nom: string;
    type: TypeLieux;  // Enum TypeLieux
    adresse: string;
    note: number;
    longitude: number;
    latitude: number;
  };
  organismeData: {
    nom: string;
    note: number;
    photo: string;
  };
}) => {
  try {
    // Start a transaction to ensure atomicity (all-or-nothing)
    const createdEvent = await prisma.$transaction(async (tx) => {
      
      // Step 1: Create the Compte (Account)
      const createdCompte = await tx.compte.create({
        data: {
          hashedMdp: compteData.hashedMdp,
          email: compteData.email,
        },
      });

      // Step 2: Create the Lieu (Venue)
      const createdLieu = await tx.lieux.create({
        data: {
          nom: lieuData.nom,
          type: lieuData.type,
          note: lieuData.note,
          adresse: lieuData.adresse,
          longitude: lieuData.longitude,
          latitude: lieuData.latitude,
          tags: [] as Tag[]
        },
      });

      // Step 3: Create the Organisme (Organization)
      const createdOrganisme = await tx.organisme.create({
        data: {
          nom: organismeData.nom,
          note: organismeData.note,
          compteId: createdCompte.id,  // Linking the organisme to the created compte
          photo: organismeData.photo
        },
      });

      // Step 4: Create the Soiree (Event)
      const createdSoiree = await tx.soiree.create({
        data: {
          nom: nomEvent,
          description: descriptionEvent,
          photoCouverturePath: photoCouverturePath,
          debut: debut,
          fin: fin,
          lieuId: createdLieu.id,  // Linking to the created Lieu
          organismeId: createdOrganisme.id,  // Linking to the created Organisme
        },
      });

      return createdSoiree;
    });

    console.log('Event created:', createdEvent);
    return createdEvent;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};


export const createMultipleEventRandomly = async(iterations: number, lieuxId: number) => {
  for (let i =0; i< iterations; i++)
    createEvent({nom: generateRandomString(5), photoCouverturePath: generateRandomString(10),
  debut: new Date(), fin: new Date(Date.now() + 24 * 60 * 60 * 1000), lieuId: lieuxId, description: generateRandomString(30)});
}