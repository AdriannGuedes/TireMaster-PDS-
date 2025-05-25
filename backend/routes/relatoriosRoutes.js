import express from 'express';
import { relatoriosController } from '../controllers/relatoriosController.js';

const router = express.Router();

router.get('/vendasPorSemana', relatoriosController.vendasPorSemana);
router.get('/vendasPorPneu/:pneuId', relatoriosController.vendasPorPneu);
router.get('/pneusMaisVendidos', relatoriosController.pneusMaisVendidos);

export default router;