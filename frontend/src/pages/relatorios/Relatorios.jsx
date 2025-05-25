import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
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
            const response = await axios.get('http://localhost:3000/relatorios/vendasPorSemana');
            setVendasSemana(response.data);
        } catch (error) {
            console.error('Erro ao buscar vendas da semana:', error);
        }
    };

    const buscarPneus = async () => {
        try {
            const response = await axios.get('http://localhost:3000/pneus/');
            setPneus(response.data);
        } catch (error) {
            console.error('Erro ao buscar pneus:', error);
        }
    };

    const buscarVendasPorPneu = async (pneuId) => {
        try {
            const response = await axios.get(`http://localhost:3000/relatorios/vendasPorPneu/${pneuId}`);
            setVendasPorPneu(response.data);
        } catch (error) {
            console.error('Erro ao buscar vendas por pneu:', error);
        }
    };

    const buscarPneusMaisVendidos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/relatorios/pneusMaisVendidos');
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
                backgroundColor: '#0073ff55',
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const dadosVendasPorPneu = {
        labels: vendasPorPneu.map(item => `Semana ${item.semana}`),
        datasets: [
            {
                label: 'Valor Vendas Pneu (R$)',
                data: vendasPorPneu.map(item => item.valorTotal),
                backgroundColor: '#ff9800',
            },
        ],
    };

    const dadosPneusMaisVendidos = {
        labels: pneusMaisVendidos.map(item => `${item.marca} ${item.medida}`),
        datasets: [
            {
                label: 'Quantidade Vendida',
                data: pneusMaisVendidos.map(item => item.quantidadeVendida),
                backgroundColor: '#4caf50',
            },
        ],
    };

    return (
        <div className="relatorios-container">
            <h2>Relatórios de Vendas e Giro de Mercadoria</h2>

            <section className="grafico-semana">
                <h3>Vendas na Última Semana</h3>
                <Line data={dadosVendasSemana} />
            </section>

            <section className="grafico-pneu">
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
                    <Bar data={dadosVendasPorPneu} />
                ) : (
                    <p>Selecione um pneu para ver o gráfico.</p>
                )}
            </section>

            <section className="grafico-giro">
                <h3>Pneus com Maior Giro</h3>
                <Bar data={dadosPneusMaisVendidos} />
            </section>
        </div>
    );
};

export default Relatorios;