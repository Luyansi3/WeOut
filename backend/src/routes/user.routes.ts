import { Router } from 'express';
import {
    getUserById,
    sendFriendRequest,
    declineFriendRequest,
    acceptFriendRequest
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


// POST /user/sendFriendRequest/:id - ajouter une demande d'amitié
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
/**
 * @openapi
 * /api/users/declineFriendRequest/{id}:
 *   post:
 *     tags:
 *       - Utilisateurs
 *     summary: Refuser une demande d’amitié reçue par un autre utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’utilisateur qui refuse la demande
 *       - in: query
 *         name: senderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’utilisateur ayant envoyé la demande
 *     responses:
 *       200:
 *         description: Demande d’amitié refusée ou statut retourné
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: already_friends
 *       400:
 *         description: Paramètre manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/declineFriendRequest/:id', declineFriendRequest);



//POST /user/acceptFriendRequest/:id - accepter demande d'amis
/**
 * @openapi
 * /api/users/acceptFriendRequest/{id}:
 *   post:
 *     tags:
 *       - Utilisateurs
 *     summary: Accepter une demande d’amitié reçue par un autre utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’utilisateur qui accepte la demande
 *       - in: query
 *         name: senderId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l’utilisateur ayant envoyé la demande
 *     responses:
 *       200:
 *         description: Demande d’amitié acceptée ou statut retourné
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: already_friends
 *       400:
 *         description: Paramètre manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/acceptFriendRequest/:id', acceptFriendRequest);

export default router;
