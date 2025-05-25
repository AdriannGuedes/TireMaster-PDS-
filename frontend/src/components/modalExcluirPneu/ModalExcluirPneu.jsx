const ModalExcluirPneu = ({ mensagem, onConfirmar, onCancelar }) => {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <p>{mensagem}</p>
          <div className="modal-buttons">
            <button onClick={onConfirmar}>Sim</button>
            <button onClick={onCancelar}>Cancelar</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default ModalExcluirPneu;