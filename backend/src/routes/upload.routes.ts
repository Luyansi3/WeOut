import { Router } from 'express';
import { upload } from '../middlewares/uploadMiddleware';
import {
    getImageByName,
} from '../controllers/upload.controller';

const router : Router = Router();


// GET /upload/path - récupérer une par filename
/**
 * @openapi
 * /api/uploads/{filename}:
 *   get:
 *     tags:
 *       - Uploads
 *     summary: Accéder à une image privée via un nom et un chemin réel
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom apparent dans l’URL (utilisé à des fins d’affichage uniquement)
 *       - name: relativeFilePath
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: "Chemin relatif réel du fichier (ex: users/photo.jpg)"
 *     responses:
 *       200:
 *         description: Image retournée avec succès
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Accès interdit (chemin illégal)
 *       404:
 *         description: Fichier introuvable
 *       500:
 *         description: Erreur interne serveur
 */
router.get('/:filename', getImageByName);


/**
 * @openapi
 * /api/uploads:
 *   post:
 *     summary: Upload une image
 *     tags:
 *       - Uploads
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: URL du fichier
 */
router.post('/', upload.single('file'), (req, res) => {
  const filePath = '/uploads/${req.file.filename}';
  res.status(201).json({ path: filePath });
});





export default router;
