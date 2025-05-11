import express, { Application, Request, Response } from 'express';  // Remplacer require par import
import { PrismaClient } from '@prisma/client';
import UserRoutes from './routes/user.routes';  // Assurer que 'routes' est bien exporté en TypeScript
import SoireeRoutes from './routes/soiree.routes';  
import dotenv from 'dotenv';
import { setupSwagger } from './swagger';

dotenv.config();

const port = process.env.NODE_PORT || 3000;

const app : Application = express();
const prisma : PrismaClient = new PrismaClient();

setupSwagger(app);

// Middleware pour parser le JSON
app.use(express.json());

// Routes de l'API  
app.use('/api/users', UserRoutes);
app.use('/api/soirees', SoireeRoutes);

// Démarrer le serveur
app.listen(port, () => {
  console.log('Backend is running on port ', port);
});
