/* import { Tag, TypeLieux } from "@prisma/client";
import {
    generateRandomString,
    createUser,
    makeUsersFriends,
    sendRequest,
    createMultipleUsersRandomly,
    createLieu,
    createOrganisme,
    createEvent,
    createEventWithLieuAndOrganisme,
    createMultipleEventRandomly
} from "./seed"


 
 
//Appeler les fonctions comme bon nous semble pour peupler la BD
 
const seed = async() => {
    createMultipleUsersRandomly(10);
    const lieux = await createLieu({nom: generateRandomString(5), type: "BOITE", adresse: generateRandomString(20),
            longitude: 0, latitude: 0
    });
    createMultipleEventRandomly(20, lieux.id);
        
    const userData = {
        hashedMdp: 'hashedPassword123',
        nom: 'Doe',
        prenom: 'John',
        email: 'bCg6f@example.com',
    };
    
    const lieuData = {
        nom: 'Le Club Paris',
        type: 'BAR',
        note: 4.2,
        adresse: '12 Rue de Paris, 75001 Paris',
        latitude: 48.8566,
        longitude: 2.3522,
        tags: ['ELECTRO', 'HOUSE'],
    };
    
    const organismeData = {
        nom: 'Techno Nights',
        compteId: '1234567890abcdef', // Replace with a valid compteId
        note: 4.5,
        tags: ['TECHNO', 'COMMERCIAL'],
    };
    
    
    
    const eventData = {
      nomEvent: 'Techno Party',
      descriptionEvent: 'The best techno party in town!',
      photoCouverturePath: 'image.jpg',
      debut: new Date('2025-06-01T20:00:00'),
      fin: new Date('2025-06-01T23:59:59'),
      compteData: {
        hashedMdp: 'hashedPassword123',
        email: 'user@example.com',
      },
      lieuData: {
        nom: 'Night Club',
        type: TypeLieux.BAR,  // Enum TypeLieux
        adresse: '123 Party St, Berlin',
        note: 4.5,
        longitude: 13.4050,
        latitude: 52.5200,
        tags: [Tag.ELECTRO, Tag.HOUSE],  // Array of Tag objects
      },
      organismeData: {
        nom: 'Party Organizers Inc.',
        note: 4.7,
        tags: [Tag.ELECTRO, Tag.HOUSE],
        photo: "eventimage.jpg"
      },
      tagList: [Tag.ELECTRO, Tag.HOUSE],
    };
    
    createEventWithLieuAndOrganisme(eventData)
      .then(event => {
        console.log('Event successfully created:', event);
      })
      .catch(error => {
        console.error('Error creating event:', error);
      });
}
 

 









  seed(); */

import { Compte, Lieux, Organisme, PrismaClient, Soiree, Tag, TypeLieux, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import {
  seedComptes,
  seedUsers,
  seedOrganisme,
  seedLieux,
  seedSoiree,
  generateNightOutTime
} from './seed'; // replace with actual path

const prisma = new PrismaClient();

async function seedAll() {
  // STEP 1: Seed 20 comptes
  await seedComptes();
  const comptes: Compte[] = await prisma.compte.findMany();

  // STEP 2: Create 10 users with first 10 comptes
  const userPromises: Promise<User>[] = [];
  for (let i = 0; i < 10; i++) {
    userPromises.push(
      seedUsers({
        prenom: faker.person.firstName(),
        nom: faker.person.lastName(),
        pseudo: faker.internet.userName(),
        bio: faker.lorem.sentence(),
        genre: 'HOMME',
        compteId: comptes[i].id,
        nombreAmis: Math.floor(Math.random() * 300),
        longitude: 4.85,
        latitude: 45.75,
        dateActualisation: new Date(),
        ami: [],
        amiDe: [],
        bloque: [],
        bloquant: [],
        demandeEnvoye: [],
        demandeRecue: [],
        photoProfil: faker.image.avatar(),
        lienInsta: faker.internet.url(),
        lienTwitter: faker.internet.url(),
        dancing: Math.floor(Math.random() * 100),
        talking: Math.floor(Math.random() * 100),
        alcohool: Math.floor(Math.random() * 100),
        groupes: [],
        commentaires: [],
        likes: [],
        photos: [],
        compte: comptes[i],
        nombreSoiree: Math.floor(Math.random() * 50)
  })
    );
  }
  const users: User[] = await Promise.all(userPromises);

  // STEP 3: Create 10 organismes with next 10 comptes
  const organismePromises: Promise<Organisme>[] = [];
  for (let i = 10; i < 20; i++) {
    organismePromises.push(seedOrganisme({ compte: comptes[i] }));
  }
  const organismes = await Promise.all(organismePromises);

  // STEP 4: Create 20 lieux
  const lieuxPromises: Lieux[] = [];
  for (let i = 0; i < 20; i++) {
    lieuxPromises.push(
      await seedLieux({
        type: faker.helpers.arrayElement(Object.values(TypeLieux)),
      })
    );
  }
  const lieux = await Promise.all(lieuxPromises);

  // STEP 5: Create 20 soirées using random lieu & organisme
  const soireePromises: Promise<Soiree>[] = [];
  for (let i = 0; i < 20; i++) {
    const lieu = faker.helpers.arrayElement(lieux);
    const orga = faker.helpers.arrayElement(organismes);
    const { debut, fin } = generateNightOutTime() as { debut: Date; fin: Date };
    soireePromises.push(
      seedSoiree({
        photoCouverturePath: "eventimage.png",
        lieuId: lieu.id,
        organismeId: orga.id,
        tags: [faker.helpers.arrayElement(Object.values(Tag))],
        debut: debut,
        fin: fin,
      })
    );
  }
  const soirees = await Promise.all(soireePromises);

  console.log(`✅ Seed complete:
- Users: ${users.length}
- Organismes: ${organismes.length}
- Lieux: ${lieux.length}
- Soirees: ${soirees.length}`);
}

seedAll()
  .then(() => {
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });