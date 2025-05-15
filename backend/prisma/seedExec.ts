import {
  Compte,
  Lieux,
  Organisme,
  PrismaClient,
  Soiree,
  Tag,
  TypeLieux,
  User,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import {
  seedComptes,
  seedUsers,
  seedOrganisme,
  seedLieux,
  seedSoiree,
  seedGroupe,
  generateNightOutTime,
} from './seed'; // Adjust path if needed

const prisma = new PrismaClient();

async function seedAll() {
  // STEP 1: Seed 20 comptes
  await seedComptes();
  const comptes: Compte[] = await prisma.compte.findMany();

  // STEP 2: Create 10 users
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
        photoProfil: `pf_${i}.jpg`,
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
        nombreSoiree: Math.floor(Math.random() * 50),
      })
    );
  }
  const users: User[] = await Promise.all(userPromises);

  // STEP 3: Create 10 organismes
  const organismePromises: Promise<Organisme>[] = [];
  for (let i = 10; i < 20; i++) {
    organismePromises.push(seedOrganisme({ compte: comptes[i], photo: `pf_${i}.jpg` }));
  }
  const organismes = await Promise.all(organismePromises);

  // STEP 4: Create 20 lieux
  const lieuxPromises: Promise<Lieux>[] = [];
  for (let i = 0; i < 20; i++) {
    lieuxPromises.push(
      seedLieux({
        type: faker.helpers.arrayElement(Object.values(TypeLieux)),
      })
    );
  }
  const lieux = await Promise.all(lieuxPromises);

  // STEP 5: Create 20 soirées
  const soirees: Soiree[] = [];
  for (let i = 0; i < 20; i++) {
    const lieu = faker.helpers.arrayElement(lieux);
    const orga = faker.helpers.arrayElement(organismes);
    const { debut, fin } = generateNightOutTime() as { debut: Date; fin: Date };

    const soiree = await seedSoiree({
      photoCouverturePath: 'eventimage.png',
      lieuId: lieu.id,
      organismeId: orga.id,
      tags: [faker.helpers.arrayElement(Object.values(Tag))],
      debut,
      fin,
    });

    soirees.push(soiree);

    // Add group with 3–6 random users
    const shuffled = faker.helpers.shuffle(users);
    const groupUsers = shuffled.slice(0, faker.number.int({ min: 3, max: 6 }));

    await seedGroupe({
      users: groupUsers.map((u) => ({ id: u.id })),
      soireeId: soiree.id,
    });
  }

  console.log(`✅ Seed complete:
- Users: ${users.length}
- Organismes: ${organismes.length}
- Lieux: ${lieux.length}
- Soirees: ${soirees.length}`);
}

seedAll()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
