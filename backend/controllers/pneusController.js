import * as Pneus from '../models/pneusModel.js';

export const listarPneus = async (req, res) => {
    const pneus = await Pneus.BuscarTodos();
    res.json(pneus);
}


export const criarPneu = async (req, res) => {
    const { marca, medida, quantidade, preco } = req.body;

    if (!marca || !medida || quantidade == null || preco == null) {
        return res.status(400).json({ msg: 'Preencha todos os campos obrigatórios: marca, medida, quantidade e preco.' });
    }

    try {
        const id = await Pneus.criarPneu(req.body);
        res.status(201).json({ msg: 'Pneu criado', id });
    } catch (error) {
        console.error('Erro ao criar pneu:', error);
        res.status(500).json({ msg: 'Erro ao criar pneu', error });
    }
};

export const atualizarPneu = async (req, res) => {
    const resultado = await Pneus.atualizarPneu(req.params.id, req.body);

    if (resultado.sucesso) {
        res.json({ msg: resultado.mensagem });
    } else {
        res.status(400).json({ erro: resultado.mensagem });
    }
};

export const excluirPneu = async (req, res) => {
    await Pneus.excluirPneu(req.params.id);
    res.json({ msg: 'Pneu excluído' });
};

export const adicionarEstoque = async (req, res) => {
    const { marca, medida, quantidade } = req.body;

    if (!marca || !medida || quantidade == null) {
        return res.status(400).json({ msg: 'Preencha marca, medida e quantidade para adicionar ao estoque.' });
    }

    try {
        const novoEstoque = await Pneus.adicionarEstoque(marca, medida, quantidade);
        return res.json({ msg: 'Estoque atualizado com sucesso.', novoEstoque });
    } catch (error) {
        if (error.message === 'Pneu não encontrado com a marca e medida informadas.') {
            return res.status(404).json({ msg: error.message });
        }

        console.error('Erro ao adicionar estoque:', error);
        return res.status(500).json({ msg: 'Erro interno ao atualizar estoque.' });
    }
};