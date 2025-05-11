import { Router } from 'express';
import {
    getUserById,
    sendFriendRequest,
    declineFriendRequest
} from '../controllers/user.controller';

const router : Router = Router();


// GET /user/:id - récupérer un utilisateur par ID

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Utilisateurs
 *     summary: Récupère un utilisateur par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de l’utilisateur
 *     responses:
 *       200:
 *         description: Données utilisateur trouvées
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

router.get('/:id', getUserById);


// POST /user/sendFrienshipRequest/:id - ajouter une demande d'amitié
/**
 * @openapi
 * /api/users/sendFriendRequest/{id}:
 *   post:
 *     tags:
 *       - Utilisateurs
 *     summary: Envoie une demande d’amitié à un autre utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’utilisateur qui envoie la demande
 *       - in: query
 *         name: receiverId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’utilisateur recevant la demande
 *     responses:
 *       200:
 *         description: Demande d’amitié envoyée ou statut retourné
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: already_sent
 *       400:
 *         description: Paramètre manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/sendFriendRequest/:id', sendFriendRequest);


// POST /user/declineFriendRequest/:id - refuser relation d'amitié
router.post('/declineFriendRequest/:id', declineFriendRequest);
// POST /user/addFrienship/:id - ajouter une relation d'amitié




export default router;
