import express, { Request, Response } from 'express';  // Remplacer require par import
import { PrismaClient } from '@prisma/client';
import routes from './routes';  // Assurer que 'routes' est bien exporté en TypeScript
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.NODE_PORT || 3000;

const app = express();
const prisma = new PrismaClient();

// Middleware pour parser le JSON  
app.use(express.json());            

// Routes de l'API         
app.use('/api', routes);

// Démarrer le serveur
app.listen(port, () => {
  console.log('Backend is running on port ', port);
});
  