import { Router } from 'express';
import {
    getUserById,
    sendFriendRequest,
    declineFriendRequest,
    acceptFriendRequest,
    getListFriends,
    participateEvent,
    updateUserInfo,
    signupUser
} from '../controllers/user.controller';

const router : Router = Router();

/**
 * @openapi
 * /signup:
 *   post:
 *     tags:
 *       - Utilisateurs 
 *     summary: Crée un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - username
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: clx1avc123456a0xyz
 *                 prenom:
 *                   type: string
 *                   example: Jean
 *                 nom:
 *                   type: string
 *                   example: Dupont
 *                 pseudo:
 *                   type: string
 *                   example: jean.d
 *       400:
 *         description: Champs invalides ou manquants
 *       409:
 *         description: Email ou nom d'utilisateur déjà utilisé
 *       500:
 *         description: Erreur serveur
 */

router.post('/signup', signupUser);

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




// GET /users/getListFriends/:id - récupérer un utilisateur par ID

/**
 * @openapi
 * /api/users/getListFriends/{id}:
 *   get:
 *     tags:
 *       - Utilisateurs
 *     summary: Récupère la liste d'amis par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de l’utilisateur dont on veut récupérer les amis
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
router.get('/getListFriends/:id', getListFriends);


// POST /users/participate/:id - Faire participer un user à une soirée

/**
 * @openapi
 * /api/users/participate/{id}:
 *   post:
 *     tags:
 *       - Utilisateurs
 *       - Soirées
 *     summary: Inscrit un utilisateur à une soirée
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de l’utilisateur que l'on veut inscrire à la soirée
 *       - in: path
 *         name: partyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de la soirée à laquelle on veut inscrire l'utilisateur      
 *     responses:
 *       201:
 *         description: inscription réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouvé ou soirée non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post('/participate/:id', participateEvent);



/**
 * @openapi
 * /api/users/updateUserInfo/{id}:
 *   patch:
 *     tags:
 *       - Utilisateurs
 *     summary: Met à jour les informations d’un utilisateur
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de l’utilisateur à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prenom:
 *                 type: string
 *               nom:
 *                 type: string
 *               genre:
 *                 type: string
 *                 enum: [HOMME, FEMME, AUTRE]
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Mise à jour réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.patch('/updateUserInfo/:id', updateUserInfo);

export default router;
