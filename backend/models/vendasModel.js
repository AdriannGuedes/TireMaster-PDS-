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
        // Buscar o pneu pela marca e medida
        const pneuQuery = await pneusRef
            .where('marca', '==', item.marca)
            .where('medida', '==', item.medida)
            .limit(1)
            .get();

        if (pneuQuery.empty) {
            return {
                erro: `Pneu ${item.marca} ${item.medida} não encontrado.`
            };
        }

        const pneuDoc = pneuQuery.docs[0];
        const pneu = pneuDoc.data();
        const estoqueAtual = pneu.quantidade || 0;

        if (estoqueAtual < item.quantidade) {
            return {
                erro: `Estoque insuficiente para o pneu ${item.marca} ${item.medida}. Disponível: ${estoqueAtual}, solicitado: ${item.quantidade}`
            };
        }

        const valorUnitario = pneu.preco || 0;
        const novoEstoque = estoqueAtual - item.quantidade;

        // Atualiza o estoque
        batch.update(pneusRef.doc(pneuDoc.id), { quantidade: novoEstoque });

        // Soma ao valor total
        valorTotal += valorUnitario * item.quantidade;

        // Salva dados completos para o item
        itensComValores.push({
            pneuId: pneuDoc.id,
            quantidade: item.quantidade,
            valorUnitario
        });
    }

    // Cria o documento da venda
    const vendaDoc = vendasRef.doc();
    batch.set(vendaDoc, {
        dataVenda: Timestamp.now(),
        valorTotal,
    });

    // Adiciona os itens da venda
    for (const item of itensComValores) {
        const itemDoc = itensVendaRef.doc();
        batch.set(itemDoc, {
            vendaId: vendaDoc.id,
            pneuId: item.pneuId,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
        });
    }

    // Executa tudo de uma vez
    await batch.commit();

    // Verifica novamente o estoque para gerar notificação se necessário
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