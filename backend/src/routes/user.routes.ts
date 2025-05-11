import { Router } from 'express';
import {
    getUserById,
    sendFriendRequest,
    declineFriendRequest
} from '../controllers/user.controller';

const router : Router = Router();


// GET /user/:id - récupérer un utilisateur par ID
router.get('/:id', getUserById);


// POST /user/addFrienship/:id - ajouter une relation d'amitié
router.post('/addFriendship/:id', sendFriendRequest);


// POST /user/declineFriendship/:id - refuser relation d'amitié
router.post('/declineFriendship/:id', declineFriendRequest);

export default router;
