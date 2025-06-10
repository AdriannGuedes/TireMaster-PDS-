import express from 'express';
import { vendasPorSemana, vendasPorPneu, pneusMaisVendidos } from '../controllers/relatoriosController.js';

const router = express.Router();

router.get('/vendasPorSemana', vendasPorSemana);
router.get('/vendasPorPneu/:pneuId',vendasPorPneu);
router.get('/pneusMaisVendidos', pneusMaisVendidos);

export default router;