import express, { Request, Response } from 'express';  // Remplacer require par import
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Définir une route GET pour récupérer les utilisateurs
router.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error });
  }
});

// Exporter le routeur
export default router;
