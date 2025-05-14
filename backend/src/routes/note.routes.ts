
import { Router } from "express";
import { postNote } from "../controllers/note.controller";
import { getNoteSoiree } from "../controllers/note.controller";

const router: Router = Router();

/**
 * @openapi
 * /api/notes:
 *   post:
 *     tags:
 *       - Notes
 *     summary: Ajoute une note ou met à jour une note pour une soirée (1/h max)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - soireeId
 *               - note
 *             properties:
 *               userId:
 *                 type: string
 *               soireeId:
 *                 type: integer
 *               note:
 *                 type: integer
 *                 description: Valeur de la note (ex: 1 à 5)
 *     responses:
 *       201:
 *         description: Note créée avec succès
 *       400:
 *         description: Requête invalide
 *       429:
 *         description: Limite d’une note par heure atteinte
 *       500:
 *         description: Erreur serveur
 */
router.post("/", postNote);

router.get('/getNote/:id', getNoteSoiree);
export default router;

