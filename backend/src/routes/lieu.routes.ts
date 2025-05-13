import { Router } from 'express';
import {
    getLieuById,
    getLieux,
} from '../controllers/lieu.controller';

const router : Router = Router();


// GET /lieux/:id - récupérer un lieu par ID

/**
 * @openapi
 * /api/lieux/id/{id}:
 *   get:
 *     tags:
 *       - Lieux
 *     summary: Récupère un lieu par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique du lieu
 *     responses:
 *       200:
 *         description: Lieu trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lieu'
 *       404:
 *         description: Lieu non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getLieuById);



// GET /lieux - récupérer tous les lieux avec filtres de tags
/**
 * @openapi
 * /api/lieux:
 *   post:
 *     tags:
 *       - Lieux
 *     summary: Récupère tous les lieux correspondant à une liste de tags
 *     parameters:
 *       - in: query
 *         name: isStrictTag
 *         required: true
 *         schema:
 *           type: boolean
 *         description:
 *           'true' pour que tous les tags soient requis (hasEvery),
 *           'false' pour qu'au moins un des tags soit requis (hasSome)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["ELECTRO", "HOUSE"]
 *             required:
 *               - tags
 *     responses:
 *       200:
 *         description: Liste des lieux correspondant aux filtres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lieu'
 *       400:
 *         description: Requête invalide (paramètre manquant ou mal formé)
 *       500:
 *         description: Erreur serveur
 */

router.get('/', getLieux);

export default router;

export default router;
