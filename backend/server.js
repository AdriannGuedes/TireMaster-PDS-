import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import pneuRoutes from './routes/pneusRoutes.js'

dotenv.config();

const app = express();
app.use(express.json());

app.use('/login', authRoutes);
app.use('/pneus', pneuRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT,() => {console.log(`Servidor Rodando na porta ${PORT}`)});