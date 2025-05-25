import express from 'express';
import { listarTodasNotificacoes, listarNotificacoesNaoLidas, marcarComoLida } from '../controllers/notifController.js';

const router = express.Router();

router.get('/todasNotificacoes', listarTodasNotificacoes);
router.get('/notifNaoLidas', listarNotificacoesNaoLidas);
router.put('/:id/marcarComoLida', marcarComoLida);

export default router;