import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance.js';
import './notificacoes.css';

const HistoricoNotificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);

  const fetchNotificacoes = async () => {
    try {
      const res = await axiosInstance.get('/notificacoes/todasNotificacoes');
      setNotificacoes(res.data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const marcarComoLida = async (id) => {
    try {
      await axiosInstance.put(`/notificacoes/${id}/marcarComoLida`);
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
      );
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  };

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  return (
    <div className="container">
      <h2>Notificações</h2>
      {notificacoes.length === 0 ? (
        <p>Nenhuma notificação encontrada.</p>
      ) : (
        <div className="notificacao-lista">
          {notificacoes.map((notificacao) => (
            <div
              key={notificacao.id}
              className={`notificacao-card ${notificacao.lida ? 'lida' : 'nao-lida'}`}
            >
              <div className="topo-card">
                <p className="mensagem">{notificacao.mensagem}</p>
                <p className="data-texto">{notificacao.data}</p>
              </div>
              {!notificacao.lida && (
                <button
                  className="botao-ler"
                  onClick={() => marcarComoLida(notificacao.id)}
                >
                  Marcar como lida
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoricoNotificacoes;