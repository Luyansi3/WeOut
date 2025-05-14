import { Router } from 'express';
import {
    getUserById,
    sendFriendRequest,
    declineFriendRequest,
    acceptFriendRequest,
    getListFriends,
    participateEvent,
    updateUserInfo,
    signupUser,
    checkFriendshipStatus,
    signinUser,
    getMeUser,
    signoutUser,
    unsubscribeEvent,
    isSubscribed
} from '../controllers/user.controller';
import { requireBody } from '../middlewares/requireBody.middlewares';
import { authenticateToken } from '../middlewares/auth.middlewares';

const router : Router = Router();


/**
 * @openapi
 * /users/signout:
 *   post:
 *     tags:
 *       - Utilisateurs
 *     summary: Déconnecte l’utilisateur
 *     description: Invalide le token côté client (aucune action serveur)
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/signout', signoutUser);

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags:
 *       - Utilisateurs
 *     summary: Récupère les informations de l’utilisateur connecté
 *     description: Nécessite un token JWT valide dans l'en-tête "Authorization  Bearer <token>"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l’utilisateur connecté
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 prenom:
 *                   type: string
 *                 nom:
 *                   type: string
 *                 pseudo:
 *                   type: string
 *                 bio:
 *                   type: string
 *                   nullable: true
 *       401:
 *         description: Requête non autorisée (token manquant ou invalide)
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/me', authenticateToken, getMeUser);

/**
 * @openapi
 * /users/signin:
 *   post:
 *     tags:
 *       - Utilisateurs
 *     summary: Connexion d’un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Connexion réussie, JWT retourné
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Email ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */
router.post('/signin', requireBody, signinUser);


/**
 * @openapi
 * /users/signup:
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
 *                   format: uuid
 *                 prenom:
 *                   type: string
 *                 nom:
 *                   type: string
 *                 genre:
 *                   type: string
 *                   nullable: true
 *                 longitude:
 *                   type: number
 *                   nullable: true
 *                 latitude:
 *                   type: number
 *                   nullable: true
 *                 dateActualisation:
 *                   type: string
 *                   format: date-time
 *                 bio:
 *                   type: string
 *                   nullable: true
 *                 photoProfil:
 *                   type: string
 *                   nullable: true
 *                 pseudo:
 *                   type: string
 *                 lienInsta:
 *                   type: string
 *                   nullable: true
 *                 lienTwitter:
 *                   type: string
 *                   nullable: true
 *                 dancing:
 *                   type: string
 *                   nullable: true
 *                 talking:
 *                   type: string
 *                   nullable: true
 *                 alcohool:
 *                   type: string
 *                   nullable: true
 *                 compteId:
 *                   type: string
 *                   format: uuid
 *                 nombreSoiree:
 *                   type: integer
 *       400:
 *         description: Champs invalides ou manquants
 *       409:
 *         description: Email ou nom d'utilisateur déjà utilisé
 *       500:
 *         description: Erreur serveur
 */

router.post('/signup', requireBody, signupUser);

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
router.post('/sendFriendRequest/:id', requireBody, sendFriendRequest);


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
router.post('/declineFriendRequest/:id', requireBody, declineFriendRequest);



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
router.post('/acceptFriendRequest/:id', requireBody, acceptFriendRequest);




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
router.post('/participate/:id', requireBody, participateEvent);



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




/**
 * @openapi
 * /api/users/updateUserInfo/{id}:
 *   patch:
 *     tags:
 *       - Utilisateurs
 *     summary: Renvoie le status entre deux users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de l’utilisateur actif (dont on cherche le status)
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de l'utilisateur avec lequel la relation est
 *     responses:
 *       200:
 *         description: Mise à jour réussie
 *         content:
 *           application/json:
 *             schema:
 *               enum : {blocked, blocked_by, already_friends, already_sent, already_received}
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/friendhsipStatus/:id', checkFriendshipStatus);





/**
 * @openapi
 * /api/users/unsubscribeFromEvent/{id}:
 *   patch:
 *     tags:
 *       - Utilisateurs
 *       - Soirees
 *     summary: Désinscrit un user d'une soirée
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de l’utilisateur que l'on cherche à désinscrire
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID unique de la soirée à laquelle on cherche à désinscrire le user
 *     responses:
 *       201:
 *         description: Mise à jour réussie
 *         content:
 *           application/json:
 *             schema:
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/unsubscribeFromEvent/:id', unsubscribeEvent);





/**
 * @openapi
 * /api/users/unsubscribeFromEvent/{id}:
 *   patch:
 *     tags:
 *       - Utilisateurs
 *       - Soirees
 *     summary: Vérifie si un user est inscrit à une soirée
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de l’utilisateur
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID unique de la soirée
 *     responses:
 *       201:
 *         description: Mise à jour réussie
 *         content:
 *           application/json:
 *             schema:
 *              result :
 *                type: boolean
 *       400:
 *         description: Requête invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/isSubscribed/:id', isSubscribed);

export default router;
