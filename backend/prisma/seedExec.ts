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