
import { Router } from 'express';
import acomodacaoController from '../controllers/acomodacaoController';

const router = Router();


router
    .route('/')
    .post(acomodacaoController.createCustom)
    .get(acomodacaoController.getAll);


router
    .route('/:id')
    .get(acomodacaoController.getById)
    .put(acomodacaoController.update)
    .delete( acomodacaoController.delete);

router.post('/defaults', acomodacaoController.createDefaults);



export default router;