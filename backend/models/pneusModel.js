import { db } from "../config/firebase.js";
import { Timestamp } from 'firebase-admin/firestore';

const pneusRef = db.collection('Pneus');

export const getTodos = async () => {
    const snapshot = await pneusRef.get();
    return snapshot.docs.map(doc => {
        const data = doc.data();

        return {
            id: doc.id,
            ...data,
            dataCadastro: data.dataCadastro?.toDate().toISOString()
        };
    });
};

export const criarPneu = async (dados) => {
    dados.dataCadastro = Timestamp.now();
    const docRef = await pneusRef.add(dados);
    return docRef.id;
};

export const atualizarPneu = async (id, dados) => {
    try {
        // Lista dos campos obrigatórios
        const camposObrigatorios = ['marca', 'medida', 'preco', 'quantidade'];

        for (const campo of camposObrigatorios) {
            const valor = dados[campo];

            if (valor === null || valor === '' || valor === undefined) {
                throw new Error(`O campo "${campo}" não pode ser nulo ou vazio.`);
            }
        }

        if (typeof dados.preco === 'string') {
            dados.preco = parseFloat(dados.preco.replace(',', '.')).toFixed(2);
        }

        if (typeof dados.quantidade !== 'number') {
            throw new Error('O campo "quantidade" deve ser um número.');
        }

        await pneusRef.doc(id).update(dados);

        return { sucesso: true, mensagem: 'Pneu atualizado com sucesso.' };
    } catch (error) {
        console.error('Erro ao atualizar pneu:', error.message);
        return { sucesso: false, mensagem: `Erro ao atualizar pneu: ${error.message}` };
    }
};

export const excluirPneu = async (id) => {
    await pneusRef.doc(id).delete();
};

export const adicionarEstoque = async (marca, medida, quantidade) => {
    const snapshot = await db.collection('Pneus')
        .where('marca', '==', marca)
        .where('medida', '==', medida)
        .get();

    if (snapshot.empty) {
        throw new Error('Pneu não encontrado com a marca e medida informadas.');
    }

    const pneuDoc = snapshot.docs[0];
    const pneuRef = pneuDoc.ref;
    const estoqueAtual = pneuDoc.data().quantidade || 0;
    const novoEstoque = estoqueAtual + quantidade;

    await pneuRef.update({ quantidade: novoEstoque });

    return novoEstoque;
};