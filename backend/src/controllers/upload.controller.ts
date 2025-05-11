import { Request, Response } from "express";
import fs from 'fs';
import path from 'path'

export const getImageByName = async (req: Request, res: Response) => {
    const filename : string = req.params.filename;
    const  relativeFilePath  = req.query.relativeFilePath  as string || undefined;
    try {
        const baseDir = path.resolve(__dirname, '../../uploads');
        const filePath = path.resolve(baseDir, relativeFilePath ?? filename);
        // 🔒 Anti-path-traversal
        if (!filePath.startsWith(baseDir)) {
            res.status(403).send('Forbidden access');
        }
        if (!fs.existsSync(filePath)) {
            res.status(404).send('File not found');
        }
        // 📦 Active un cache privé de 1h
        res.status(200).sendFile(filePath);
    } catch(error) {
        res.status(500).json({error : 'Server error'});
    }

    return;
};

