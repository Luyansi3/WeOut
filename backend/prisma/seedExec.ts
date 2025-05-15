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
import { hashPassword } from '../src/utils/hash';

const prisma = new PrismaClient();

async function seedAll() {
  // STEP 1: Seed 20 comptes
  const email: string = "remi.vialleton@gmail.com"
  const mdp: string = "azertyuiop"
  const hashedMdp: string = await hashPassword(mdp);
  await seedComptes(hashedMdp, email);
  const comptes: Compte[] = await prisma.compte.findMany({
    where: {
      NOT: {
        email: email
      }
    }
  });
  const compte_unique = await prisma.compte.findFirst({
    where: {
      email: email
    }
  });

  if (!compte_unique) {
    throw new Error(`Compte with email ${email} not found`);
  }

  // STEP 2: Create 10 users
  const userPromises: Promise<User>[] = [];

  const user_unique = await seedUsers({
        prenom: "Rémi",
        nom: "Vialleton",
        pseudo: "remivialleton",
        bio: "Just a test bio",
        genre: 'HOMME',
        compteId: compte_unique.id,
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
        photoProfil: "pf_0.jpg",
        lienInsta: faker.internet.url(),
        lienTwitter: faker.internet.url(),
        dancing: Math.floor(Math.random() * 100),
        talking: Math.floor(Math.random() * 100),
        alcohool: Math.floor(Math.random() * 100),
        groupes: [],
        commentaires: [],
        likes: [],
        photos: [],
        compte: compte_unique,
        nombreSoiree: Math.floor(Math.random() * 50),
      })
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
        longitude: faker.location.longitude({ min: 4.8, max: 4.9 }),
        latitude: faker.location.latitude({ min: 45.7, max: 45.8 }),
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

  const lieu = await seedLieux({
        type: faker.helpers.arrayElement(Object.values(TypeLieux)),
        longitude: 4.85,
        latitude: 45.75,
      })


  for (let i = 0; i < 20; i++) {
    lieuxPromises.push(
      seedLieux({
        type: faker.helpers.arrayElement(Object.values(TypeLieux)),
      })
    );
  }
  const lieux = await Promise.all(lieuxPromises);
  const lieu_unique = await Promise.resolve(lieu)

  // STEP 5: Create 20 soirées
  const soirees: Soiree[] = [];
  const {debut, fin} = generateNightOutTime() as { debut: Date; fin: Date };
  const soiree = await seedSoiree({
      photoCouverturePath: 'eventimage.png',
      lieuId: lieu_unique.id,
      organismeId: organismes[0].id,
      tags: [faker.helpers.arrayElement(Object.values(Tag))],
      debut,
      fin,
    })

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
    const group = await seedGroupe({
      users: [user_unique],
      soireeId: soiree.id,
    })
    await seedGroupe({
      users: groupUsers.map((u) => ({ id: u.id })),
      soireeId: soiree.id,
    });
  }
  console.log("soirée id", soiree.id)

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
