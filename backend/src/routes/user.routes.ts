import { Router } from 'express';
import {
    getUserById,
    sendFriendRequest,
    declineFriendRequest,
    acceptFriendRequest
} from '../controllers/user.controller';

const router : Router = Router();


// GET /user/:id - récupérer un utilisateur par ID
router.get('/:id', getUserById);


// POST /user/sendFrienshipRequest/:id - ajouter une demande d'amitié
router.post('/sendFriendRequest/:id', sendFriendRequest);


// POST /user/declineFriendRequest/:id - refuser relation d'amitié
router.post('/declineFriendRequest/:id', declineFriendRequest);


//POST /user/acceptFriendRequest/:id - accepter demande d'amis
router.post('/acceptFriendRequest/:id', acceptFriendRequest);

export default router;
