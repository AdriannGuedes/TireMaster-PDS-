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

export const getPorMarca = async (marca) => {
    const snapshot = await pneusRef.where('marca', '==', marca).get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            dataCadastro: data.dataCadastro?.toDate().toISOString()
        };
    });
};

export const getPorMedida = async (medida) => {
    const snapshot = await pneusRef.where('medida', '==', medida).get();

    if (snapshot.empty) {
        return [];
    }

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
    await pneusRef.doc(id).update(dados);
};

export const excluirPneu = async (id) => {
    await pneusRef.doc(id).delete();
};