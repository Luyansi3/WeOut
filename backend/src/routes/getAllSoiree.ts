// routes/soiree.routes.ts
import { Router } from 'express';
import { getAllSoirees } from '../controllers/getAllSoireeControllers';

const router: Router = Router();

// GET /soirees - récupérer toutes les soirées
router.get('/soirees', getAllSoirees);

export default router;
