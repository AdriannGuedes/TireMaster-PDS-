import React, { useState } from 'react';
import axiosInstance from '../../services/axiosInstance.js';
import './Cadastro.css';

const Cadastro = () => {
  const [marca, setMarca] = useState('');
  const [medida, setMedida] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setProgress(10);


    if (!marca || !medida || !preco || !quantidade) {
      setError('Todos os campos devem ser preenchidos!');
      setLoading(false);
      return;
    }

    if (isNaN(quantidade) || parseInt(quantidade, 10) <= 0) {
      setError('Quantidade deve ser um número válido maior que zero!');
      setLoading(false);
      return;
    }

    const precoFormatado = parseFloat(preco.replace(',', '.')).toFixed(2);

    const novoPneu = {
      marca,
      medida,
      preco: Number(precoFormatado),
      quantidade: parseInt(quantidade, 10),
    };


    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 80) return prevProgress + 10;
        return prevProgress;
      });
    }, 300);

    try {
      const response = await axiosInstance.post(
        '/pneus/cadastrarPneu',
        novoPneu
      );
      clearInterval(interval);
      setProgress(100);
      console.log('Pneu cadastrado com sucesso:', response.data);
      setMarca('');
      setMedida('');
      setPreco('');
      setQuantidade('');
      setLoading(false);
    } catch (error) {
      clearInterval(interval);
      setProgress(100);
      console.error('Erro ao cadastrar pneu:', error.response || error);
      setError('Erro ao cadastrar pneu! Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastrar Pneu</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            placeholder="Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Medida"
            value={medida}
            onChange={(e) => setMedida(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Adicionar'}
        </button>
      </form>
      {loading && (
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};

export default Cadastro;