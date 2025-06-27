import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance.js';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import './Relatorios.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

const Relatorios = () => {
    const [vendasSemana, setVendasSemana] = useState([]);
    const [pneus, setPneus] = useState([]);
    const [vendasPorPneu, setVendasPorPneu] = useState([]);
    const [pneuSelecionado, setPneuSelecionado] = useState('');
    const [pneusMaisVendidos, setPneusMaisVendidos] = useState([]);

    useEffect(() => {
        buscarVendasSemana();
        buscarPneus();
        buscarPneusMaisVendidos();
    }, []);

    useEffect(() => {
        if (pneuSelecionado) {
            buscarVendasPorPneu(pneuSelecionado);
        } else {
            setVendasPorPneu([]);
        }
    }, [pneuSelecionado]);

    const buscarVendasSemana = async () => {
        try {
            const response = await axiosInstance.get('/relatorios/vendasPorSemana');
            setVendasSemana(response.data);
        } catch (error) {
            console.error('Erro ao buscar vendas da semana:', error);
        }
    };

    const buscarPneus = async () => {

        try {
            const response = await axiosInstance.get('/pneus/');
            setPneus(response.data);
        } catch (error) {
            console.error('Erro ao buscar pneus:', error.response?.data || error.message);
        }
    };

    const buscarVendasPorPneu = async (pneuId) => {
        try {
            const response = await axiosInstance.get(`/relatorios/vendasPorPneu/${pneuId}`);
            setVendasPorPneu(response.data);
        } catch (error) {
            console.error('Erro ao buscar vendas por pneu:', error);
        }
    };

    const buscarPneusMaisVendidos = async () => {
        try {
            const response = await axiosInstance.get('/relatorios/pneusMaisVendidos');
            setPneusMaisVendidos(response.data);
        } catch (error) {
            console.error('Erro ao buscar pneus mais vendidos:', error);
        }
    };

    const dadosVendasSemana = {
        labels: vendasSemana.map(item => `Semana ${item.semana}`),
        datasets: [
            {
                label: 'Valor de Vendas (R$)',
                data: vendasSemana.map(item => item.valorTotal),
                borderColor: '#0073ff',
                backgroundColor: '#27567c',
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const dadosVendasPorPneu = {
        labels: ['Total'],
        datasets: [
            {
                label: 'Valor Vendas por Pneu (R$)',
                data: [parseFloat(vendasPorPneu.total)],
                backgroundColor: '#27567c',
            },
        ],
    };

    const optionsPneusMaisVendidos = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        if (Number.isInteger(value)) {
                            return value;
                        }
                        return null;
                    }
                }
            }
        }
    };

    const dadosPneusMaisVendidos = {
        labels: pneusMaisVendidos.map(item => item.pneu),
        datasets: [
            {
                label: 'Quantidade Vendida',
                data: pneusMaisVendidos.map(item => item.quantidade),
                backgroundColor: '#27567c',
            },
        ],
    };

    return (
        <div className="relatorios-container-scroll">
            <div className="grafico-card">
                <h3>Vendas na Última Semana</h3>
                <div style={{ width: '100%', maxWidth: 600 }}>
                    <Line
                        data={dadosVendasSemana}
                        height={200}
                        options={{
                            responsive: true,
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            return `R$ ${parseFloat(context.raw).toFixed(2)}`;
                                        },
                                    },
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: function (value) {
                                            return `R$ ${parseFloat(value).toFixed(2)}`;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
            <div className="grafico-card">
                <h3>Valor de Vendas por Pneu</h3>
                <select
                    value={pneuSelecionado}
                    onChange={(e) => setPneuSelecionado(e.target.value)}
                    className="select-pneu"
                >
                    <option value="">Selecione um pneu</option>
                    {pneus.map((pneu) => (
                        <option key={pneu.id} value={pneu.id}>
                            {pneu.marca} {pneu.medida}
                        </option>
                    ))}
                </select>

                {pneuSelecionado ? (
                    <div style={{ width: '100%', maxWidth: 600 }}>
                        <Bar
                            data={dadosVendasPorPneu}
                            height={200}
                            options={{
                                responsive: true,
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                return `R$ ${parseFloat(context.raw).toFixed(2)}`;
                                            },
                                        },
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: function (value) {
                                                return `R$ ${parseFloat(value).toFixed(2)}`;
                                            },
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                ) : (
                    <p>Selecione um pneu para ver o gráfico.</p>
                )}
            </div>


            <div className="grafico-card">
                <h3>Pneus com Maior Giro</h3>
                <div style={{ width: '100%', maxWidth: 600 }}>
                    <Bar data={dadosPneusMaisVendidos} options={optionsPneusMaisVendidos} height={200} />
                </div>
            </div>

        </div>
    );
};

export default Relatorios;