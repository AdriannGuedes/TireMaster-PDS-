import * as Vendas from '../models/vendasModel.js';

export const criarVenda = async (req, res) => {
    const itens = req.body.itens;

    if (!Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ msg: 'A venda deve conter pelo menos um item.' });
    }

    for (const item of itens) {
        if (!item.marca || !item.medida || !item.quantidade) {
            return res.status(400).json({ msg: 'Todos os campos dos itens são obrigatórios.' });
        }
    }

    const resultado = await Vendas.criarVenda(itens);

    if (resultado.erro) {
        return res.status(400).json({ msg: resultado.erro });
    }

    res.status(201).json({ msg: 'Venda registrada', id: resultado });
};

export const listarVendas = async (req, res) => {
    const vendas = await Vendas.listarVendas();
    res.json(vendas);
};

export const listarItensDaVenda = async (req, res) => {
    const { id } = req.params;

    const itens = await Vendas.buscarItensDaVenda(id);

    if (itens.length === 0) {
        return res.status(404).json({ msg: 'Nenhum item encontrado para esta venda.' });
    }

    res.json(itens);
};