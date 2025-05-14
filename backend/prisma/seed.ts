/* import {PrismaClient, Tag, TypeLieux} from "@prisma/client";

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
} */


import { Genre, PrismaClient, User, Groupe, Commentaire, Photo, Compte, Tag, TypeLieux } from '@prisma/client';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

export function generateNightOutTime(): {} {
  // Random date within the next 30 days
  const debut = faker.date.soon({ days: 7 });

  // Set debut time between 8 PM and 11 PM
  debut.setHours(faker.number.int({ min: 20, max: 23 }));
  debut.setMinutes(faker.number.int({ min: 0, max: 59 }));
  debut.setSeconds(0);
  debut.setMilliseconds(0);

  // Clone and set fin time between 2 AM and 6 AM the next day
  const fin = new Date(debut);
  fin.setDate(debut.getDate() + 1);
  fin.setHours(faker.number.int({ min: 0, max: 6 }));
  fin.setMinutes(faker.number.int({ min: 0, max: 59 }));
  fin.setSeconds(0);
  fin.setMilliseconds(0);

  return { debut, fin };
}

export async function seedComptes(
  hashedMdp: string = faker.internet.password(),
  email: string = faker.internet.email({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  })
) {
  await prisma.compte.create({
      data: {
        email: email,
        hashedMdp: hashedMdp,
      },
    });

  for (let i = 0; i < 20; i++) {
    await prisma.compte.create({
      data: {
        email: faker.internet.email({
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
        }),
        hashedMdp: faker.internet.password(),
      },
    });
  }
}

export async function seedUsers({
  prenom = faker.person.firstName(),
  nom = faker.person.lastName(),
  pseudo = faker.internet.userName(),
  bio = faker.lorem.sentence(),
  genre = 'HOMME',
  compteId,
  nombreAmis = 0,
  longitude = 4.85,
  latitude = 45.75,
  dateActualisation = new Date(),
  ami = [],
  amiDe = [],
  bloque = [],
  bloquant = [],
  demandeEnvoye = [],
  demandeRecue = [],
  photoProfil = faker.image.avatar(),
  lienInsta = faker.internet.url(),
  lienTwitter = faker.internet.url(),
  dancing = 0,
  talking = 0,
  alcohool = 0,
  groupes = [],
  commentaires = [],
  likes = [],
  photos = [],
  compte,
  nombreSoiree = 0,
}: {
  prenom?: string;
  nom?: string;
  pseudo?: string;
  bio?: string;
  genre?: Genre;
  compteId?: string;
  nombreAmis?: number;
  longitude?: number;
  latitude?: number;
  dateActualisation?: Date;
  ami?: User[];
  amiDe?: User[];
  bloque?: User[];
  bloquant?: User[];
  demandeEnvoye?: User[];
  demandeRecue?: User[];
  photoProfil?: string;
  lienInsta?: string;
  lienTwitter?: string;
  dancing?: number;
  talking?: number;
  alcohool?: number;
  groupes?: Groupe[];
  commentaires?: Commentaire[];
  likes?: Photo[];
  photos?: Photo[];
  compte: Compte;
  nombreSoiree?: number;
}): Promise<User> {
  return await prisma.user.create({
    data: {
      prenom,
      nom,
      pseudo,
      bio,
      genre,
      nombreAmis,
      longitude,
      latitude,
      dateActualisation,
      photoProfil,
      lienInsta,
      lienTwitter,
      dancing,
      talking,
      alcohool,
      nombreSoiree,
      compte: { connect: { id: compte.id } },
      ami: { connect: ami.map((user) => ({ id: user.id })) },
      amiDe: { connect: amiDe.map((user) => ({ id: user.id })) },
      bloque: { connect: bloque.map((user) => ({ id: user.id })) },
      bloquant: { connect: bloquant.map((user) => ({ id: user.id })) },
      demandeEnvoye: { connect: demandeEnvoye.map((user) => ({ id: user.id })) },
      demandeRecue: { connect: demandeRecue.map((user) => ({ id: user.id })) },
      groupes: { connect: groupes.map((group) => ({ id: group.id })) },
      commentaires: { connect: commentaires.map((comment) => ({ id: comment.id })) },
      likes: { connect: likes.map((photo) => ({ id: photo.id })) },
      photos: { connect: photos.map((photo) => ({ id: photo.id })) },
    },
  });
}

export async function seedOrganisme({
  nom = faker.company.name(),
  note = Math.floor(Math.random() * 100),
  photo = faker.image.avatar(),
  soirees = [],
  tags = [],
  compte,
}: {
  nom?: string;
  note?: number;
  photo?: string;
  soirees?: { id: number }[];
  tags?: Tag[];
  compte: Compte;
}) {
  return await prisma.organisme.create({
    data: {
      nom,
      note,
      photo,
      compte: {
        connect: { id: compte.id },
      },
      soirees: {
        connect: soirees.map((soiree) => ({ id: soiree.id })),
      },
      tags,
    },
  });
}

export async function seedLieux({
  nom = faker.company.name(),
  type = TypeLieux.BAR, // Or any of: BOITE, BAR, BARDANSANT, CAFE
  note = Math.floor(Math.random() * 100),
  nombreNote = 0,
  adresse = faker.location.streetAddress(),
  longitude = faker.number.float({ min: 4.8, max: 4.9 }),
  latitude = faker.location.latitude({ min:45.7, max: 45.8 }),
  tags = [],
  soirees = [],
}: {
  nom?: string;
  type?: TypeLieux;
  note?: number;
  nombreNote?: number;
  adresse?: string;
  longitude?: number;
  latitude?: number;
  tags?: Tag[];
  soirees?: { id: number }[];
}) {
  return await prisma.lieux.create({
    data: {
      nom,
      type,
      note,
      nombreNote,
      adresse,
      longitude,
      latitude,
      tags,
      soirees: {
        connect: soirees.map((s) => ({ id: s.id })),
      },
    },
  });
}

export async function seedSoiree({
  nom = faker.lorem.words(3),
  description = faker.lorem.sentences(2),
  photoCouverturePath = faker.image.url(),
  dancing = faker.number.int({ min: 0, max: 100 }),
  nbNoteDancing = 0,
  talking = faker.number.int({ min: 0, max: 100 }),
  nbNoteTalking = 0,
  alcohool = faker.number.int({ min: 0, max: 100 }),
  nbNoteAlcohool = 0,
  debut = faker.date.soon({ days: 7 }),
  fin = faker.date.soon({ days: 1, refDate: debut }),
  lieuId,
  organismeId,
  tags = [],
  groupes = [],
  photos = [],
  commentaires = [],
  nombreParticipants = 0,
}: {
  nom?: string;
  description?: string;
  photoCouverturePath?: string;
  dancing?: number;
  nbNoteDancing?: number;
  talking?: number;
  nbNoteTalking?: number;
  alcohool?: number;
  nbNoteAlcohool?: number;
  debut?: Date;
  fin?: Date;
  lieuId?: number;
  organismeId?: string;
  tags?: Tag[];
  groupes?: { id: string }[];
  photos?: { id: number }[];
  commentaires?: { id: number }[];
  nombreParticipants?: number;
}) {
  return await prisma.soiree.create({
    data: {
      nom,
      description,
      photoCouverturePath,
      dancing,
      nbNoteDancing,
      talking,
      nbNoteTalking,
      alcohool,
      nbNoteAlcohool,
      debut,
      fin,
      lieu: lieuId ? { connect: { id: lieuId } } : undefined,
      organsime: organismeId ? { connect: { id: organismeId } } : undefined,
      tags,
      groupes: groupes.length
        ? {
            connect: groupes.map((g) => ({ id: g.id })),
          }
        : undefined,
      photos: photos.length
        ? {
            connect: photos.map((p) => ({ id: p.id })),
          }
        : undefined,
      commentaires: commentaires.length
        ? {
            connect: commentaires.map((c) => ({ id: c.id })),
          }
        : undefined,
      nombreParticipants,
    },
  });
}

export async function seedGroupe({
  users = [],
  soireeId,
}: {
  users?: { id: string }[];
  soireeId: number;
}) {
  return await prisma.groupe.create({
    data: {
      id: faker.string.uuid(),
      soiree: {
        connect: { id: soireeId },
      },
      users: users.length
        ? {
            connect: users.map((u) => ({ id: u.id })),
          }
        : undefined,
    },
  });
}

export async function seedPhoto({
  soireeId,
  userId,
  likedByUsers = [],
}: {
  soireeId: number;
  userId: string;
  likedByUsers?: { id: string }[];
}) {
  return await prisma.photo.create({
    data: {
      path: "", // or your preferred file path generator
      soiree: {
        connect: { id: soireeId },
      },
      createur: {
        connect: { id: userId },
      },
      likedBy: likedByUsers.length
        ? {
            connect: likedByUsers.map((user) => ({ id: user.id })),
          }
        : undefined,
    },
  });
}

export async function seedCommentaire({
  soireeId,
  userId,
  contenu = faker.lorem.sentence(),
}: {
  soireeId: number;
  userId: string;
  contenu?: string;
}) {
  return await prisma.commentaire.create({
    data: {
      contenu,
      soiree: {
        connect: { id: soireeId },
      },
      createur: {
        connect: { id: userId },
      },
    },
  });
}

export async function addFriendship(userId1: string, userId2: string) {
  if (userId1 === userId2) {
    throw new Error("A user cannot be friends with themselves.");
  }

  // Connect userId2 to userId1's ami list
  await prisma.user.update({
    where: { id: userId1 },
    data: {
      ami: {
        connect: { id: userId2 },
      },
    },
  });

  // Connect userId1 to userId2's ami list
  await prisma.user.update({
    where: { id: userId2 },
    data: {
      ami: {
        connect: { id: userId1 },
      },
    },
  });
}
