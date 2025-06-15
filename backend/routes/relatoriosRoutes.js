import express from 'express';
import { vendasPorSemana, vendasPorPneu, pneusMaisVendidos } from '../controllers/relatoriosController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.get('/vendasPorSemana', vendasPorSemana);
router.get('/vendasPorPneu/:pneuId',vendasPorPneu);
router.get('/pneusMaisVendidos', pneusMaisVendidos);

export default router;