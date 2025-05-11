import { Router } from 'express';
import {
    getLieuById,
} from '../controllers/lieu.controller';

const router : Router = Router();


// GET /lieu/:id - récupérer un lieu par ID
router.get('/:id', getLieuById);




export default router;
