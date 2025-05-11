import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// 📁 Dossier de destination
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req:Request, file:Express.Multer.File, cb:(error: Error | null, filename: string)=> void) => {
    cb(null, uploadDir);
  },
  filename: (req:Request, file:Express.Multer.File, cb:(error: Error | null, filename: string)=> void) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
