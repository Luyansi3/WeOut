// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const compte = await prisma.compte.create({
    data: {
      email: 'test@example.com',
      hashedMdp: 'hashed-password',
    },
  });

  const user = await prisma.user.create({
    data: {
      prenom: 'Alice',
      nom: 'Dupont',
      genre: 'FEMME',
      longitude: 2.35,
      latitude: 48.85,
      dateActualisation: new Date(),
      compte: {
        connect: { id: compte.id },
      },
    },
  });

  console.log('User created:', user);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
