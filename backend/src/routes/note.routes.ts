import { Router } from 'express';
import { getNoteSoiree } from '../controllers/note.controller';



const router : Router = Router();




router.get('/getNote/:id', getNoteSoiree);



export default router;