import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Estoque.css';
import FormEditarPneuModal from '../../components/modalEditarPneu/ModalEditarPneu.jsx';
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
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.get('http://localhost:3000/pneus/', {
                headers: { Authorization: `Bearer ${token}` },
            });
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

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este pneu?')) return;

        const token = localStorage.getItem('authToken');
        try {
            await axios.delete(`http://localhost:3000/pneus/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchPneus();
        } catch (error) {
            console.error('Erro ao excluir pneu', error);
            alert('Erro ao excluir pneu.');
        }
    };

    const handleEdit = (pneu) => {
        setPneuEditando(pneu);
    };

    const handleSaveEdit = async (dadosEditados) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`http://localhost:3000/pneus/${dadosEditados.id}`, dadosEditados, {
                headers: { Authorization: `Bearer ${token}` },
            });
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

            {/* Modal de Edição */}
            {pneuEditando && (
                <FormEditarPneuModal
                    pneu={pneuEditando}
                    onSave={handleSaveEdit}
                    onClose={() => setPneuEditando(null)}
                />
            )}
        </>
    );
};

export default Estoque;