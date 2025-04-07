import { db, Timestamp } from '../config/firebase.js'

const vendasRef = db.collection('vendas');
const itensVendaRef = db.collection('itensVenda');

export const criarVenda = async (itens) => {
    let valorTotal = 0;

    for (const item of itens) {
        valorTotal += item.valorUnitario * item.quantidade;
    }

    const vendaDoc = await vendasRef.add({
        dataVenda: Timestamp.now(),
        valorTotal,
    });

    const batch = db.batch();

    itens.forEach(item => {
        const itemDoc = itensVendaRef.doc();
        batch.set(itemDoc, {
            vendaId: vendaDoc.id,
            pneuId: item.pneuId,
            quantidade: item.quantidade,
            valorUnitario: item.valorUnitario,
        });
    });

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