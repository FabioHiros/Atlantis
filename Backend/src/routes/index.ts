
import { Router } from 'express';
import acomodacaoRoutes from './acomodacaoRoutes';
import estadiaRoutes from './estadiaRoutes';
import clienteRoutes from './clienteRoutes';

const router = Router();

router.use('/acomodacoes', acomodacaoRoutes);
router.use('/clientes', clienteRoutes);
router.use('/estadias', estadiaRoutes);

export default router;