
import { Router } from 'express';
import  clienteController from '../controllers/clienteController';

const router = Router();

// Get all clientes
router.get('/', clienteController.getAll);

// Get all titulares
router.get('/titulares', clienteController.getAllTitulares);

// Get all dependentes
router.get('/dependentes', clienteController.getAllDependentes);

// Get cliente by ID
router.get('/:id', clienteController.getById);

// Get dependentes by titular ID
router.get('/titular/:titularId/dependentes', clienteController.getDependentesByTitularId);

// Create a new titular
router.post('/titular', clienteController.createTitular);

// Create a new dependente
router.post('/titular/:titularId/dependente', clienteController.createDependente);

// Update cliente
router.put('/:id', clienteController.updateCliente);

// Update cliente endereco
router.put('/:id/endereco', clienteController.updateClienteEndereco);

// Add documento to cliente
router.post('/:id/documento', clienteController.addDocumentoToCliente);

// Add telefone to cliente
router.post('/:id/telefone', clienteController.addTelefoneToCliente);

// Delete cliente
router.delete('/:id', clienteController.deleteCliente);

export default router;