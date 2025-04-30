import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [notificacoes, setNotificacoes] = useState([]); 
  useEffect(() => {
    buscarNotificacoes();
  }, []);

  const buscarNotificacoes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/notificacoes/newNotificacoes');
      setNotificacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    }
  };

  const notificacoesParaExibir = notificacoes.slice(0, 3);

  return (
    <div className="home-container">
      <h2>Atenção! Estoque baixo!</h2>
      <div className="cards-container">
        {notificacoesParaExibir.length > 0 ? (
          notificacoesParaExibir.map((notificacao, index) => (
            <div key={index} className="card">
              <div className="card-header"></div>
              <h3>Notificação!</h3>
              <p>{notificacao.mensagem}</p>
            </div>
          ))
        ) : (
          <p>Carregando notificações...</p>
        )}
      </div>
    </div>
  );
};

export default Home;