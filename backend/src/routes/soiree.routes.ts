import { Router } from 'express';
import {
    getSoireeById,
    getSoirees,
    getSoireeByName,
    deleteSoiree,
    getSoireeByUserId,
    postSoiree
} from '../controllers/soiree.controller';

const router : Router = Router();


// GET /soirees/:id - récupérer une soirée par ID

/**
 * @openapi
 * /api/soirees/{id}:
 *   get:
 *     tags:
 *       - Soirées
 *     summary: Récupère une soirée par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique de la soirée
 *     responses:
 *       200:
 *         description: Soirée trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soiree'
 *       404:
 *         description: Soirée non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getSoireeById);

/**
 * @openapi
 * /api/soirees:
 *   get:
 *     tags:
 *       - Soirées
 *     summary: Récupère toutes les soirées
 *     description: Renvoie toutes les soirées enregistrées. Peut filtrer celles à venir avec le paramètre `active=true`.
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Si `true`, retourne uniquement les soirées futures.
 *     responses:
 *       200:
 *         description: Liste des soirées récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Soiree'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getSoirees);

/**
 * @openapi
 * /api/soirees/name/{name}:
 *   get:
 *     tags:
 *       - Soirées
 *     summary: Récupère les soirées par nom
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom recherché de la soirée
 *     responses:
 *       200:
 *         description: Liste des soirées correspondant au nom
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Soiree'
 *       500:
 *         description: Erreur serveur
 */

router.get('/name/:name', getSoireeByName);


// POST /soirees/:id - récupérer un utilisateur par ID

/**
 * @openapi
 * /api/soirees/delete/{id}:
 *   delete:
 *     tags:
 *       - Soirées
 *     summary: Supprime une soirée par son ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique de la soirée à supprimer
 *     responses:
 *       200:
 *         description: Soirée supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Requête invalide (ID manquant ou incorrect)
 *       404:
 *         description: Soirée non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/delete/:id', deleteSoiree);
/**
 * @openapi
 * /api/soirees:
 *   post:
 *     tags:
 *       - Soirées
 *     summary: Créer une nouvelle soirée et lier des entités existantes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - description
 *               - photoCouverturePath
 *               - debut
 *               - fin
 *               - lieuId
 *               - organismeId
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               photoCouverturePath:
 *                 type: string
 *               debut:
 *                 type: string
 *                 format: date-time
 *               fin:
 *                 type: string
 *                 format: date-time
 *               lieuId:
 *                 type: integer
 *               organismeId:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Liste des tags déjà existantes à associer
 *     responses:
 *       201:
 *         description: Soirée créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soiree'
 *       400:
 *         description: Données manquantes ou invalides
 *       500:
 *         description: Erreur interne serveur
 */
router.post('/', postSoiree);



// GET /soirees/getByUserId/:id - Récupérer toutes les soirées d'un user


/**
 * @openapi
 * /api/soirees/getByUserId/{id}:
 *   GET:
 *     tags:
 *       - Soirées
 *       - User
 *     summary: Get toutes les soirées auxquelles participe un User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique du user dont on récupère les soirées
 *     responses:
 *       200:
 *         description: Obtenir la liste de soirée d'un User
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Requête invalide (ID manquant ou incorrect)
 *       404:
 *         description: Soirée non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/getSoireesByUserId/:id', getSoireeByUserId);
   

export default router;
