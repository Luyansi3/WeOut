import { Router } from 'express';
import {
    getSoireeById,
    getSoirees
} from '../controllers/soiree.controller';

const router : Router = Router();


// GET /soirees/:id - récupérer un utilisateur par ID
router.get('/:id', getSoireeById);
router.get('/', getSoirees);


export default router;
