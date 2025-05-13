import { Router } from 'express';
import { getAllTags } from '../controllers/tag.controller';

const router: Router = Router();

/**
 * @openapi
 * /api/tags:
 *   get:
 *     tags:
 *       - Tags
 *     summary: Récupère tous les tags disponibles
 *     responses:
 *       200:
 *         description: Liste de tous les tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getAllTags);

export default router;
