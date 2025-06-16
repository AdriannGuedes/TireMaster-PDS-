import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance.js';
import './Home.css';

const Home = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarNotificacoes();
  }, []);

  const buscarNotificacoes = async () => {
    try {
      const response = await axiosInstance.get('/notificacoes/notifNaoLidas');
      setNotificacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const notificacoesParaExibir = notificacoes.slice(0, 3);

  return (
    <div className="home-container">
      <h2>Atenção! Estoque baixo!</h2>
      <div className="cards-container">
        {loading ? (
          <p>Carregando notificações...</p>
        ) : notificacoesParaExibir.length > 0 ? (
          notificacoesParaExibir.map((notificacao, index) => (
            <div key={index} className="card">
              <div className="card-header"></div>
              <h3>Notificação!</h3>
              <p>{notificacao.mensagem}</p>
            </div>
          ))
        ) : (
          <p>Sem novas notificações.</p>
        )}
      </div>
    </div>
  );
};

export default Home;