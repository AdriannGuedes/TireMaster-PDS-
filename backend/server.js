import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import pneuRoutes from './routes/pneusRoutes.js'
import vendasRoutes from './routes/vendasRoutes.js'
import noCacheMiddleware from './middlewares/noCacheMiddleware.js';
import notificacoesRoutes from './routes/notifRoutes.js';
import relatorioRoutes from './routes/relatoriosRoutes.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(noCacheMiddleware);

app.use('/login', authRoutes);
app.use('/pneus', pneuRoutes);
app.use('/vendas', vendasRoutes);
app.use('/notificacoes', notificacoesRoutes);
app.use('/relatorios', relatorioRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {console.log(`Servidor Rodando na porta ${PORT}`)});