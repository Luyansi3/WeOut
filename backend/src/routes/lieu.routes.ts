import { Router } from 'express';
import {
    getLieuById,
    getLieux,
} from '../controllers/lieu.controller';
import { requireBody } from '../middlewares/requireBody.middlewares';

const router: Router = Router();

// GET /lieux/:id - récupérer un lieu par ID
/**
 * @openapi
 * /api/lieux/{id}:
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
 *     summary: Met à jour la base de lieux depuis Google Places et retourne les lieux filtrés par tags
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isStrictTag:
 *                 type: boolean
 *                 description: true pour exiger tous les tags (hasEvery), false pour au moins un tag (hasSome)
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des tags à filtrer (ex. ['HOUSE', 'TECHNO'])
 *               location:
 *                 type: array
 *                 items:
 *                   type: number
 *                 minItems: 2
 *                 maxItems: 2
 *                 description: Coordonnées GPS sous forme [latitude, longitude]
 *               radius:
 *                 type: number
 *                 description: Rayon de recherche autour de la position (en mètres)
 *             required:
 *               - isStrictTag
 *               - location
 *               - radius
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

router.post('/', requireBody, getLieux);


export default router;
