import { db } from "../config/firebase.js";
import { Timestamp } from 'firebase-admin/firestore';

const vendasRef = db.collection('Vendas');
const itensVendaRef = db.collection('ItensVenda');
const pneusRef = db.collection('Pneus');

export const criarVenda = async (itens) => {
    let valorTotal = 0;
    const batch = db.batch();
    const itensComValores = [];

    for (const item of itens) {
        const pneuSnap = await pneusRef.doc(item.pneuId).get();

        if (!pneuSnap.exists) {
            return { erro: `Pneu com ID ${item.pneuId} não encontrado.` };
        }

        const pneu = pneuSnap.data();
        const estoqueAtual = pneu.quantidade || 0;

        if (estoqueAtual < item.quantidade) {
            return {
                erro: `Estoque insuficiente para o pneu ${pneu.marca} ${pneu.medida}. Disponível: ${estoqueAtual}, solicitado: ${item.quantidade}`
            };
        }

        const valorUnitario = pneu.preco || 0;
        const novoEstoque = estoqueAtual - item.quantidade;

        batch.update(pneusRef.doc(item.pneuId), { quantidade: novoEstoque });

        valorTotal += valorUnitario * item.quantidade;

        itensComValores.push({
            pneuId: item.pneuId,
            quantidade: item.quantidade,
            valorUnitario
        });
    }

    const vendaDoc = vendasRef.doc();
    batch.set(vendaDoc, {
        dataVenda: Timestamp.now(),
        valorTotal,
    });

    for (const item of itensComValores) {
        const itemDoc = itensVendaRef.doc();
        batch.set(itemDoc, {
            vendaId: vendaDoc.id,
            pneuId: item.pneuId,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
        });
    }

    await batch.commit();

    // Geração de notificação
    for (const item of itensComValores) {
        const pneuSnap = await pneusRef.doc(item.pneuId).get();
        const pneu = pneuSnap.data();

        if (pneu.quantidade <= 4) {
            await db.collection('Notificacoes').add({
                data: Timestamp.now(),
                mensagem: `Pneu ${pneu.marca} ${pneu.medida} está com estoque baixo: ${pneu.quantidade}`
            });
        }
    }

    return vendaDoc.id;
};
export const listarVendas = async () => {
    const snapshot = await vendasRef.get();

    const vendas = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            dataVenda: data.dataVenda?.toDate().toISOString(),
        };
    });
    vendas.sort((a, b) => new Date(b.dataVenda) - new Date(a.dataVenda));

    return vendas;
};

export const buscarItensDaVenda = async (vendaId) => {
    const snapshot = await itensVendaRef.where('vendaId', '==', vendaId).get();

    if (snapshot.empty) {
        return [];
    }

    const itens = await Promise.all(snapshot.docs.map(async (doc) => {
        const itemData = doc.data();
        let marca = 'Desconhecida';
        let medida = '';

        try {
            const pneuSnap = await pneusRef.doc(itemData.pneuId).get();
            if (pneuSnap.exists) {
                const pneuData = pneuSnap.data();
                marca = pneuData.marca || 'Sem marca';
                medida = pneuData.medida || '';
            }
        } catch (err) {
            console.error(`Erro ao buscar pneu ${itemData.pneuId}:`, err);
        }

        return {
            id: doc.id,
            ...itemData,
            marca,
            medida,
        };
    }));

    return itens;
};