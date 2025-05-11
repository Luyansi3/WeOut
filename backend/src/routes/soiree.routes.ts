import { Router } from 'express';
import {
    getSoireeById,
    getSoirees,
    getSoireeByName
} from '../controllers/soiree.controller';

const router : Router = Router();


// GET /soirees/:id - récupérer un utilisateur par ID
router.get('/id/:id', getSoireeById);
router.get('/', getSoirees);
router.get('/name/:name', getSoireeByName);


export default router;
