import { db } from '../config/firebase.js';

export const listarNotificacoes = async (req, res) => {
    try {
        const snapshot = await db.collection('Notificacoes').orderBy('data', 'desc').get();

        const notificacoes = snapshot.docs.map(doc => {
            const data = doc.data();
            console.log('Documento:', data);
            return {
                id: doc.id,
                ...data,
                data: data.data?.toDate().toLocaleString('pt-BR') 
            };
        });

        res.json(notificacoes);
    } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        res.status(500).json({ msg: 'Erro ao buscar notificações', error });
    }
};