import { obterRelatorioComFiltros } from '../models/relatorioModel.js';

export const gerarRelatorio = async (req, res) => {
    try {
        const { marca, medida } = req.query; // <-- importante: req.query e não req.body
        const resultado = await obterRelatorioComFiltros({ marca, medida });
        res.json(resultado);
      } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        res.status(500).json({ erro: 'Erro ao gerar relatório' });
      }
};