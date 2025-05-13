import { Router } from 'express';
import {
    getSoireeById,
    getSoirees,
    getSoireeByName,
    deleteSoiree,
    getSoireeByUserId,
    postSoiree,
    putSoiree,
    getGroupsBySoireeId,
    getEventsByDatesAndId,
    getParticipants,
    getComments
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
 *         name: from
 *         required: false
 *         schema:
 *           type: DateFormat "YYYY-MM-dd HH:mm"
 *         description: Date à partir de laquelle on cherche les soirées, si pas renseigné depuis le debut
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: DateFormat "YYYY-MM-dd HH:mm"
 *         description: Date à partir de laquelle on cherche les soirées, si pas renseigné jusqu'à la fin
*        - in: query
*          name: isStrictTag
*          required: true
*          schema:
*           type: boolean
*          description: si true; les soirées doivent inclure tous les tags, sinon au moins un
*        - in: body
*          name: tags
*          required: true
*          schema:
*           tags:
*                 type: array
*                 items:
*                   type: string
*          description: liste des tags pour la recherche, si vide pas de filtre
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

/**
 * @openapi
 * /api/soirees/createSoiree/{id}:
 *   put:
 *     summary: Met à jour une soirée existante
 *     tags:
 *       - Soirées
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la soirée à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *     responses:
 *       200:
 *         description: Soirée mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Soiree'
 *       404:
 *         description: Soirée non trouvée
 *       400:
 *         description: Requête invalide
 */

router.put("createSoiree/:id", putSoiree);


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




/**
 * @openapi
 * /api/soirees/getByUserId/{id}:
 *   GET:
 *     tags:
 *       - Soirées
 *       - User
 *     summary: Get toutes les soirées auxquelles participe ou a participé un User avant ou après une certaine date
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique du user dont on récupère les soirées
 *       - in: query
 *         name: isBoolean
 *         required: true
 *         schema:
 *           type: boolean
 *         description: true ou false pour définir si on prend les events avant ou après
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: dateFormat "YYYY-MM-DDTHH:mm"
 *         description: date au bon format avec laquelle on compare (now par défaut)
 *     responses:
 *       200:
 *         description: Obtention réussie avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Requête invalide (ID manquant ou incorrect)
 *       404:
 *         description: Soirées ou User non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/getEventsByDateAndId/:id', getEventsByDatesAndId);
   

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
   
/**
 * @openapi
 * /api/soirees/groups/{id}:
 *   get:
 *     tags:
 *       - Soirées
 *     summary: Récupère les groupes associés à une soirée donnée
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la soirée
 *     responses:
 *       200:
 *         description: Groupes récupérés avec succès
 *       400:
 *         description: Format de l’ID invalide
 *       404:
 *         description: Soirée non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/groups/:id', getGroupsBySoireeId);




/**
 * @openapi
 * /api/soirees/participants/{id}:
 *   get:
 *     tags:
 *       - Soirées
 *       - Participants
 *     summary: Récupère les participants d'une soirée donnée
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique de la soirée
 *     responses:
 *       200:
 *         description: Participants récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 participants:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Format de l’ID invalide
 *       404:
 *         description: Soirée non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/participants/:id', getParticipants);



/**
 * @openapi
 * /api/soirees/comments/{id}:
 *   get:
 *     tags:
 *       - Soirées
 *       - Commentaires
 *     summary: Récupère les commentaires d'une soirée
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID unique de la soirée
 *     responses:
 *       200:
 *         description: Commentaires récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 commentaires:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       contenu:
 *                         type: string
 *                       soireeId:
 *                         type: integer
 *                       userId:
 *                         type: string
 *                       createur:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           prenom:
 *                             type: string
 *                           nom:
 *                             type: string
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Soirée non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/comments/:id', getComments);


export default router;
