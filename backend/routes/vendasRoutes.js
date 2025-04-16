import express from 'express';
import { criarVenda, listarVendas, listarItensDaVenda } from '../controllers/vendasController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/gerarVenda', criarVenda);
router.get('/listarVendas', listarVendas);
router.get('/:id/itens', listarItensDaVenda);

export default router;