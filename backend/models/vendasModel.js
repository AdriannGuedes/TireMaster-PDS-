import { db } from "../config/firebase.js";
import { Timestamp } from 'firebase-admin/firestore';

const vendasRef = db.collection('Vendas');
const itensVendaRef = db.collection('ItensVenda');
const pneusRef = db.collection('Pneus');

export const criarVenda = async (itens) => {
    let valorTotal = 0;
    const batch = db.batch();

    // Primeiro, verifica e atualiza o estoque dos pneus
    for (const item of itens) {
        const pneuDocRef = pneusRef.doc(item.pneuId);
        const pneuSnap = await pneuDocRef.get();

        if (!pneuSnap.exists) {
            throw new Error(`Pneu com ID ${item.pneuId} não encontrado.`);
        }

        const pneu = pneuSnap.data();
        const estoqueAtual = pneu.quantidade || 0;

        if (estoqueAtual < item.quantidade) {
            return {
                erro: `Estoque insuficiente para o pneu ${item.pneuId}. Disponível: ${estoqueAtual}, solicitado: ${item.quantidade}`
            };
        }

        const novoEstoque = estoqueAtual - item.quantidade;

        // Atualiza o estoque
        batch.update(pneuDocRef, { quantidade: novoEstoque });

        // Soma ao valor total
        valorTotal += item.valorUnitario * item.quantidade;
    }

    // Cria o documento da venda
    const vendaDoc = vendasRef.doc();
    batch.set(vendaDoc, {
        dataVenda: Timestamp.now(),
        valorTotal,
    });

    // Adiciona os itens da venda
    itens.forEach(item => {
        const itemDoc = itensVendaRef.doc();
        batch.set(itemDoc, {
            vendaId: vendaDoc.id,
            pneuId: item.pneuId,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
        });
    });

    // Executa tudo de uma vez
    await batch.commit();

    return vendaDoc.id;
};

export const listarVendas = async () => {
    const snapshot = await vendasRef.get();

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            dataVenda: data.dataVenda?.toDate().toISOString(),
        };
    });
};

export const buscarItensDaVenda = async (vendaId) => {
    const snapshot = await itensVendaRef.where('vendaId', '==', vendaId).get();

    if (snapshot.empty) {
        return [];
    }

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
};