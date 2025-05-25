import { db } from '../config/firebase.js';
import { Timestamp } from 'firebase-admin/firestore';

const pneusRef = db.collection('Pneus');
const notificacoesRef = db.collection('Notificacoes');

export const verificarEstoqueBaixo = async () => {
    const snapshot = await pneusRef.get();

    const notificacoes = [];

    snapshot.forEach(doc => {
        const pneu = doc.data();
        const estoque = pneu.quantidade || 0;

        if (estoque <= 4) {
            const mensagem = estoque === 0
                ? `Pneu ${pneu.marca} ${pneu.medida} está sem estoque.`
                : `Pneu ${pneu.marca} ${pneu.medida} com estoque baixo (${estoque} unidades).`;

            notificacoes.push({
                data: Timestamp.now(),
                mensagem,
                lida: false
            });
        }
    });

    
    const batch = db.batch();
    notificacoes.forEach(n => {
        const docRef = notificacoesRef.doc();
        batch.set(docRef, n);
    });

    await batch.commit();
};