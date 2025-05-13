import { Router } from 'express';
import {
    getLieuById,
    getAllLieux,
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



// GET /lieux - récupérer tous les lieux avec filtres
/**
 * @openapi
 * /api/lieux:
 *   get:
 *     tags:
 *       - Lieux
 *     summary: Récupère tous les lieux avec filtres optionnels
 *     parameters:
 *       - in: query
 *         name: tags
 *         required: false
 *         schema:
 *           type: string
 *         description: Liste de tags séparés par des virgules (ex: ELECTRO,HOUSE)
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date à laquelle une soirée doit être en cours
 *     responses:
 *       200:
 *         description: Liste des lieux correspondant aux filtres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lieu'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getAllLieux);

export default router;

export default router;
