import express from 'express';
import { listarNotificacoes } from '../controllers/notifController.js';

const router = express.Router();

router.get('/newNotificacoes', listarNotificacoes);

export default router;