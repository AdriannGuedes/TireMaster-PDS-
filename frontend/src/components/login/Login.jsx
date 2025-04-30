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

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        senha,
      });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        onLogin(); // chama o callback para atualizar estado de autenticação
        navigate('/home');
      }
    } catch (error) {
      console.error(error);
      setError('Email ou senha incorretos');
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