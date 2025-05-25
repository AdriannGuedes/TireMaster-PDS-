import React, { useEffect, useState } from 'react';
import './ModalEditarPneu.css';

const ModalEditarPneu = ({ pneu, onSave, onClose }) => {
  const [marca, setMarca] = useState('');
  const [medida, setMedida] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  useEffect(() => {
    if (pneu) {
      setMarca(pneu.marca);
      setMedida(pneu.medida);
      setPreco(pneu.preco);
      setQuantidade(pneu.quantidade);
    }
  }, [pneu]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: pneu.id,
      marca,
      medida,
      preco,
      quantidade: parseInt(quantidade),
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Editar Pneu</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Marca" />
          <input type="text" value={medida} onChange={(e) => setMedida(e.target.value)} placeholder="Medida" />
          <input type="text" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="Preço" />
          <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder="Quantidade" />

          <div className="modal-buttons">
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarPneu;