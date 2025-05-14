
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
 *     summary: Ajoute une note pour une soirée (1 par heure max, si soirée en cours et user participant)
 *     description: >
 *       L'utilisateur peut noter une soirée uniquement si :
 *       - Il participe à la soirée
 *       - La soirée est actuellement en cours
 *       - Il n'a pas déjà noté dans la dernière heure
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
 *                 description: ID de l'utilisateur
 *               soireeId:
 *                 type: integer
 *                 description: ID de la soirée
 *               note:
 *                 type: integer
 *                 description: "Valeur de la note (ex: 1 à 5)"
 *     responses:
 *       201:
 *         description: Note créée avec succès
 *       400:
 *         description: Champs requis manquants ou format invalide
 *       403:
 *         description: Utilisateur non participant ou soirée non en cours
 *       429:
 *         description: L'utilisateur a déjà noté cette soirée il y a moins d'une heure
 *       500:
 *         description: Erreur serveur
 */
router.post("/", postNote);


/**
 * @openapi
 * /api/notes/getNote/{id}:
 *   get:
 *     tags:
 *       - Notes
 *     summary: Récupère la note globale d'une soirée ou les notes en live si elle est en cours
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la soirée
 *     responses:
 *       200:
 *         description: Données de notation récupérées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Peut contenir les notes live (si soirée en cours) ou la moyenne globale
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Soirée non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/getNote/:id', getNoteSoiree);
export default router;

