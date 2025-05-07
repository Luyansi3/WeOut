import express, { Request, Response } from 'express';  // Remplacer require par import
import { PrismaClient } from '@prisma/client';
import routes from './routes';  // Assurer que 'routes' est bien exporté en TypeScript

const app = express();
const prisma = new PrismaClient();

// Middleware pour parser le JSON
app.use(express.json());

// Routes de l'API
app.use('/api', routes);

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Backend is running on port 3000');
});
