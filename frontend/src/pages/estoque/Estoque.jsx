import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance.js';
import './Estoque.css';
import FormEditarPneuModal from '../../components/modalEditarPneu/ModalEditarPneu.jsx';
import ModalConfirmacao from '../../components/modalExcluirPneu/ModalExcluirPneu.jsx';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Estoque = () => {
    const [marca, setMarca] = useState('');
    const [medida, setMedida] = useState('');
    const [pneus, setPneus] = useState([]);
    const [filteredPneus, setFilteredPneus] = useState([]);
    const [pneuEditando, setPneuEditando] = useState(null);

    useEffect(() => {
        fetchPneus();
    }, []);

    const fetchPneus = async () => {
        try {
            const response = await axiosInstance.get('/pneus/');
            setPneus(response.data);
            setFilteredPneus(response.data);
        } catch (error) {
            console.error('Erro ao carregar pneus', error);
        }
    };

    const handleFilter = () => {
        const filtered = pneus.filter(pneu =>
            (marca ? pneu.marca.toLowerCase().includes(marca.toLowerCase()) : true) &&
            (medida ? pneu.medida.toLowerCase().includes(medida.toLowerCase()) : true)
        );
        setFilteredPneus(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [marca, medida]);

    const [idParaExcluir, setIdParaExcluir] = useState(null)

    const handleDelete = async (id) => {
        setIdParaExcluir(id); 
    };

    const confirmarExclusao = async () => {
        try {
            await axiosInstance.delete(`/pneus/delete/${idParaExcluir}`);
            fetchPneus();
        } catch (error) {
            console.error('Erro ao excluir pneu', error);
        } finally {
            setIdParaExcluir(null); 
        }
    };

    const cancelarExclusao = () => {
        setIdParaExcluir(null);
    };

    const handleEdit = (pneu) => {
        setPneuEditando(pneu);
    };

    const handleSaveEdit = async (dadosEditados) => {
        try {
            await axiosInstance.put(`/pneus/${dadosEditados.id}`, dadosEditados);
            setPneuEditando(null);
            fetchPneus();
        } catch (error) {
            console.error('Erro ao atualizar pneu:', error);
            alert('Erro ao atualizar pneu.');
        }
    };
    return (
        <>
            <div className="estoque-container">
                <h2>Estoque de Pneus</h2>

                <div className="filters">
                    <div className="filter-item">
                        <input
                            type="text"
                            placeholder="Pesquisar por Marca"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                        />
                    </div>
                    <div className="filter-item">
                        <input
                            type="text"
                            placeholder="Pesquisar por Medida"
                            value={medida}
                            onChange={(e) => setMedida(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pneu-list">
                    {filteredPneus.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Marca</th>
                                    <th>Medida</th>
                                    <th>Preço</th>
                                    <th>Quantidade</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPneus.map((pneu) => (
                                    <tr key={pneu.id}>
                                        <td>{pneu.marca}</td>
                                        <td>{pneu.medida}</td>
                                        <td>R$ {pneu.preco}</td>
                                        <td>{pneu.quantidade}</td>
                                        <td>
                                            <div className="btn-actions">
                                                <button onClick={() => handleEdit(pneu)} className="btn-edit">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(pneu.id)} className="btn-delete">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Nenhum pneu encontrado.</p>
                    )}
                </div>
            </div>

            {pneuEditando && (
                <FormEditarPneuModal
                    pneu={pneuEditando}
                    onSave={handleSaveEdit}
                    onClose={() => setPneuEditando(null)}
                />
            )}

            {idParaExcluir && (
                <ModalConfirmacao
                    mensagem="Tem certeza que deseja excluir este pneu?"
                    onConfirmar={confirmarExclusao}
                    onCancelar={cancelarExclusao}
                />
            )}
        </>
    );
};

export default Estoque;