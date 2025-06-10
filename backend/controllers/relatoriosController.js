import { Relatorios } from '../models/relatoriosModel.js';

export async function vendasPorSemana(req, res) {
  try {
    const dados = await Relatorios.vendasPorSemana();
    res.json(dados);
  } catch (err) {
    console.error('Erro ao buscar vendas por semana:', err);
    res.status(500).json({ msg: 'Erro no relatório de vendas semanais' });
  }
}

export async function vendasPorPneu(req, res) {
  const { pneuId } = req.params;

  try {
    const dados = await Relatorios.vendasPorPneu(pneuId);
    res.json(dados);
  } catch (err) {
    console.error('Erro ao buscar vendas por pneu:', err);
    res.status(500).json({ msg: 'Erro no relatório de vendas por pneu' });
  }
}

export async function pneusMaisVendidos(req, res) {
  try {
    const dados = await Relatorios.pneusMaisVendidos();
    res.json(dados);
  } catch (err) {
    console.error('Erro ao buscar giro de pneus:', err);
    res.status(500).json({ msg: 'Erro no relatório de giro de pneus' });
  }
}