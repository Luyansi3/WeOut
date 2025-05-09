import express, { Application, Request, Response } from 'express';  // Remplacer require par import
import { PrismaClient } from '@prisma/client';
import Userroutes from './routes/user.routes';  // Assurer que 'routes' est bien exporté en TypeScript
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.NODE_PORT || 3000;

const app : Application = express();
const prisma : PrismaClient = new PrismaClient();

// Middleware pour parser le JSON
app.use(express.json());          

// Routes de l'API  
app.use('/api', Userroutes);

// Démarrer le serveur
app.listen(port, () => {
  console.log('Backend is running on port ', port);
});
