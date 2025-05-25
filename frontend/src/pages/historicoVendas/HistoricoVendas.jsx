import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HistoricoVendas.css';

const HistoricoVendas = () => {
    const [vendasComItens, setVendasComItens] = useState([]);
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        const carregarVendas = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const resVendas = await axios.get('http://localhost:3000/vendas/listarVendas', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const vendas = resVendas.data;
                const vendasDetalhadas = await Promise.all(
                    vendas.map(async (venda) => {
                        try {
                            const resItens = await axios.get(`http://localhost:3000/vendas/${venda.id}/itens`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            return {
                                ...venda,
                                itens: resItens.data
                            };
                        } catch (err) {
                            console.error(`Erro ao buscar itens da venda ${venda.id}:`, err);
                            return {
                                ...venda,
                                itens: []
                            };
                        }
                    })
                );

                setVendasComItens(vendasDetalhadas);
            } catch (error) {
                console.error('Erro ao carregar vendas:', error);
                setMensagem('Erro ao carregar histórico de vendas.');
            }
        };

        carregarVendas();
    }, []);

    return (
        <div className="historico-container">
            <h2>Histórico de Vendas</h2>

            {mensagem && <p className="mensagem">{mensagem}</p>}
            <div className='scrow'>
                {vendasComItens.length === 0 ? (
                    <p>Nenhuma venda registrada.</p>
                ) : (

                    vendasComItens.map((venda) => (
                        <div key={venda.id} className="venda-card">
                            <div className="itens-scroll">
                                {venda.itens.map((item, index) => (
                                    <div key={index} className="item-descricao">
                                        <span>Pneu: {item.marca || 'Sem marca'} {item.medida || 'Sem medida'} - {item.quantidade}x</span>
                                        <span className="valor-unit">Valor Unid: R${parseFloat(item.valorUnitario || 0).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="venda-footer">
                                <span className="venda-data"> Data Venda: {new Date(venda.dataVenda).toLocaleDateString()}</span>
                                <span className="venda-total">Total: R${parseFloat(venda.valorTotal || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
};

export default HistoricoVendas;