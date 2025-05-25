import { db } from '../config/firebase.js';

export const listarTodasNotificacoes = async (req, res) => {
  try {
    const snapshot = await db
      .collection('Notificacoes')
      .orderBy('data', 'desc')
      .get();

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

export const listarNotificacoesNaoLidas = async (req, res) => {
  try {
    const snapshot = await db
      .collection('Notificacoes')
      .orderBy('data', 'desc')
      .get();

    const notificacoes = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        data: data.data?.toDate().toLocaleString('pt-BR'),
      };
    })
      .filter(n => n.lida === false || n.lida === undefined);

    res.json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações não lidas:', error);
    res.status(500).json({ msg: 'Erro ao buscar notificações não lidas', error });
  }
};

export const marcarComoLida = async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('Notificacoes').doc(id).update({
      lida: true
    });

    res.status(200).json({ msg: 'Notificação marcada como lida.' });
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error);
    res.status(500).json({ msg: 'Erro ao atualizar notificação', error });
  }
};