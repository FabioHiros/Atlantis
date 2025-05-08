
import { Router } from 'express';
import estadiaController from '../controllers/estadiaController';

const router = Router();

// Get all estadias
router.get('/', estadiaController.getAll);

// Get estadia by ID
router.get('/:id', estadiaController.getById);

// Get estadias by titular ID
router.get('/titular/:titularId', estadiaController.getByTitularId);

// Create a new estadia
router.post('/', estadiaController.create);

// Update estadia
router.put('/:id', estadiaController.update);

// Delete estadia
router.delete('/:id', estadiaController.delete);

export default router;