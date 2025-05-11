import { Router } from 'express';
import {
    getLieuById,
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




export default router;
