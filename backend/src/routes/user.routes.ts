import { Router } from 'express';
import {
  getUserById,
} from '../controllers/user.controller';

const router : Router = Router();


// GET /users/:id - récupérer un utilisateur par ID
router.get('/user/:id', getUserById);

export default router;
