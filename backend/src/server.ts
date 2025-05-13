import express, { Application, Request, Response } from 'express';  // Remplacer require par import
import { PrismaClient } from '@prisma/client';
import UserRoutes from './routes/user.routes';  // Assurer que 'routes' est bien exporté en TypeScript
import SoireeRoutes from './routes/soiree.routes';
import LieuRoutes from './routes/lieu.routes';
import UploadRoutes from './routes/upload.routes';
import OrgaRoutes from './routes/orga.routes';
import TagRoutes from './routes/tag.routes';
import dotenv from 'dotenv';
import { setupSwagger } from './swagger';
import path from 'path';
import cors from 'cors';

dotenv.config();

const port = process.env.NODE_PORT || 3000;
export const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret';

const app : Application = express();
const prisma : PrismaClient = new PrismaClient();

setupSwagger(app);

// Middleware pour parser le JSON
app.use(express.json());
app.use(cors({origin:'*', credentials: true}));

app.use('/static', express.static(path.join(__dirname, '../uploads')));


// Routes de l'API  
app.use('/api/users', UserRoutes);
app.use('/api/soirees', SoireeRoutes);
app.use('/api/lieux', LieuRoutes);
app.use('/api/uploads', UploadRoutes);
app.use('/api/orgas/', OrgaRoutes);
app.use('/api/tags', TagRoutes);

// Démarrer le serveur
app.listen(port, () => {
  console.log('Backend is running on port ', port);
});
