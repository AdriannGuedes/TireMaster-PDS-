import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance.js';
import './GerarVenda.css';
import { FaTrash } from 'react-icons/fa';

const RegistrarVenda = () => {
    const [pneus, setPneus] = useState([]);
    const [itens, setItens] = useState([]);
    const [pneuSelecionado, setPneuSelecionado] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        const fetchPneus = async () => {
            try {
                const response = await axiosInstance.get('/pneus/');
                setPneus(response.data);
            } catch (error) {
                console.error('Erro ao buscar pneus:', error);
            }
        };
        fetchPneus();
    }, []);

    const adicionarItem = () => {
        const pneu = pneus.find((p) => String(p.id) === String(pneuSelecionado));
        if (!pneu) return;

        const jaExiste = itens.find((item) => item.pneuId === pneu.id);
        if (jaExiste) {
            setMensagem('Esse pneu já foi adicionado!');
            return;
        }

        setItens([
            ...itens,
            {
                pneuId: pneu.id,
                marca: pneu.marca,
                medida: pneu.medida,
                preco: parseFloat(pneu.preco),
                quantidade: parseInt(quantidade),
            }
        ]);
        setQuantidade(1);
        setPneuSelecionado('');
        setMensagem('');
    };

    const removerItem = (id) => {
        setItens(itens.filter((item) => item.pneuId !== id));
    };

    const registrarVenda = async () => {
        if (itens.length === 0 || itens.some(item => !item.pneuId || isNaN(item.quantidade))) {
            setMensagem('Preencha todos os itens corretamente.');
            return;
        }

        try {
            const payload = {
                itens: itens.map((item) => ({
                    pneuId: item.pneuId,
                    quantidade: parseInt(item.quantidade),

                }))
            };
            const response = await axiosInstance.post('/vendas/gerarVenda', payload);

            setMensagem(response.data.msg || 'Venda registrada com sucesso!');
            setTimeout(() => {
                setMensagem('');
            }, 3000);
            setItens([]);
        } catch (error) {
            console.error('Erro ao registrar venda:', error.response?.data || error.message);
            const erroBackend = error.response?.data?.erro || error.response?.data?.msg || error.message;
            setMensagem(erroBackend || 'Erro ao registrar venda');

            setTimeout(() => {
                setMensagem('');
            }, 3000);

        }
    };

    const valorTotal = itens.reduce((total, item, index) => {
        const preco = parseFloat(item.preco);
        const qtd = parseInt(item.quantidade);

        if (isNaN(preco) || isNaN(qtd)) {
            console.error('Valor inválido no item', index + 1, item);
            return total;
        }
        const subtotal = preco * qtd;
        return total + subtotal;
    }, 0);

    console.log('Valor Total:', valorTotal);
    return (
        <div className="venda-container">
            <h2>Registrar Nova Venda</h2>

            <div className="form-item">
                <select value={pneuSelecionado} onChange={(e) => setPneuSelecionado(e.target.value)}>
                    <option value="">Selecione um pneu</option>
                    {pneus.map((pneu) => (
                        <option key={pneu.id} value={pneu.id}>
                            {pneu.marca} {pneu.medida} - R$ {pneu.preco}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    min={1}
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                />

                <button onClick={adicionarItem}>Adicionar Item</button>
            </div>
            <div className='itens-scroll'></div>
            <table>
                <thead>
                    <tr>
                        <th>Marca</th>
                        <th>Medida</th>
                        <th>Qtd</th>
                        <th>Valor Unit.</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {itens.map((item) => (
                        <tr key={item.pneuId}>
                            <td>{item.marca}</td>
                            <td>{item.medida}</td>
                            <td>{item.quantidade}</td>
                            <td>R$ {item.preco.toFixed(2)}</td>
                            <td>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                            <td>
                                <button onClick={() => removerItem(item.pneuId)}><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mensagem && <p className="mensagem">{mensagem}</p>}

            <h3>Total da Venda: R$ {valorTotal.toFixed(2)}</h3>

            <button onClick={registrarVenda} disabled={itens.length === 0}>
                Finalizar Venda
            </button>
        </div>
    );
};

export default RegistrarVenda;