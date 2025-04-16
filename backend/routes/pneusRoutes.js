import express from 'express';
import {
  listarPneus,
  obterPorMarca,
  obterPorMedida,
  criarPneu,
  atualizarPneu,
  excluirPneu,
  adicionarEstoque
} from '../controllers/pneusController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.get('/', listarPneus);
router.get('/marca/:marca', obterPorMarca);
router.get('/medida/:medida', obterPorMedida);
router.post('/cadastrarPneu', criarPneu);
router.put('/:id', atualizarPneu);
router.delete('/delete/:id', excluirPneu);
router.patch('/addEstoque', adicionarEstoque);

export default router;