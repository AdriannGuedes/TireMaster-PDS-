import * as Pneus from '../models/pneusModel.js';

export const listarPneus = async (req, res) => {
    const pneus = await Pneus.getTodos();
    res.json(pneus);
}

export const obterPorMarca = async (req, res) => {
    try {
        const { marca } = req.params;
        const pneus = await Pneus.getPorMarca(marca);

        if (pneus.length === 0) {
            return res.status(404).json({ msg: 'Nenhum pneu encontrado com essa marca' });
        }

        res.json(pneus);
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao buscar pneus por marca', error });
    }
};

export const obterPorMedida = async (req, res) => {
    try {
        const { medida } = req.params;
        const pneus = await Pneus.getPorMedida(medida);

        if (pneus.length === 0) {
            return res.status(404).json({ msg: 'Nenhum pneu encontrado com essa medida' });
        }

        res.json(pneus);
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao buscar pneus por medida', error });
    }
};


export const criarPneu = async (req, res) => {
    const { marca, medida, quantidade, preco } = req.body;

    // Verifica se todos os campos obrigatórios foram preenchidos
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
    await Pneus.atualizarPneu(req.params.id, req.body);
    res.json({ msg: 'Pneu atualizado' });
};

export const excluirPneu = async (req, res) => {
    await Pneus.excluirPneu(req.params.id);
    res.json({ msg: 'Pneu excluído' });
};