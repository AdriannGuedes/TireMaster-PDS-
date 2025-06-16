import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        senha,
      });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        onLogin();
        navigate('/home');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          console.warn('Email ou senha incorretos.');
          setError('E-mail ou senha incorretos.');
        } else {
          console.error(`Erro ${error.response.status}: ${error.response.data.msg || 'Erro desconhecido do servidor.'}`);
          setError('Erro ao tentar fazer login. Tente novamente mais tarde.');
        }
      } else if (error.request) {
        console.error('Sem resposta do servidor. Verifique a conexão com a API.');
        setError('Servidor indisponível. Tente novamente em instantes.');
      } else {
        console.error('Erro ao configurar a requisição:', error.message);
        setError('Erro inesperado ao tentar fazer login.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="title">TireMaster</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <h3 className="input-title">Login</h3>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">

            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red', margin: '5px 0', textAlign: 'center' }}>{error}</p>}
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;