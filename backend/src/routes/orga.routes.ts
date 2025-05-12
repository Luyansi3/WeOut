import { Router } from "express";
import { getOrgaBySoireeId } from "../controllers/orga.controller";


const router : Router = Router();

// GET /orgas/getOrgaBySoireeId/:id - récupérer un orga par l'id de la soirée

/**
 * @openapi
 * /api/orgas/getOrgaBySoireeId/{id}:
 *   get:
 *     tags:
 *       - Orga
 *     summary: recupère un orga par l'id de la soirée qu'il organise
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique de la soirée
 *     responses:
 *       200:
 *         description: orga trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orga'
 *       404:
 *         description: Orga non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getOrgaBySoireeId);

export default router;