import { Relatorios } from '../models/relatoriosModel.js';

export const relatoriosController = {
  async vendasPorSemana(req, res) {
    try {
      const dados = await Relatorios.vendasPorSemana();
      res.json(dados);
    } catch (err) {
      console.error('Erro ao buscar vendas por semana:', err);
      res.status(500).json({ msg: 'Erro no relatório de vendas semanais' });
    }
  },

  async vendasPorPneu(req, res) {
    const { pneuId } = req.params;
    try {
      const dados = await Relatorios.vendasPorPneu(pneuId);
      res.json(dados);
    } catch (err) {
      console.error('Erro ao buscar vendas por pneu:', err);
      res.status(500).json({ msg: 'Erro no relatório de vendas por pneu' });
    }
  },

  async pneusMaisVendidos(req, res) {
    try {
      const dados = await Relatorios.pneusMaisVendidos();
      res.json(dados);
    } catch (err) {
      console.error('Erro ao buscar giro de pneus:', err);
      res.status(500).json({ msg: 'Erro no relatório de giro de pneus' });
    }
  }
};