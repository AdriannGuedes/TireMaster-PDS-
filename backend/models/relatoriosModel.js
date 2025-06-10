import { db } from '../config/firebase.js';
import { startOfWeek, endOfWeek, formatISO } from 'date-fns';

const vendasRef = db.collection('Vendas');
const itensRef = db.collection('ItensVenda');
const pneusRef = db.collection('Pneus');

export const Relatorios = {
    async vendasPorSemana() {
        const snapshot = await vendasRef.get();

        const vendas = snapshot.docs.map(doc => doc.data());

        const agrupado = {};

        vendas.forEach(venda => {
            const data = venda.dataVenda.toDate();
            const semana = formatISO(startOfWeek(data, { weekStartsOn: 1 })).slice(0, 10); // YYYY-MM-DD
            if (!agrupado[semana]) agrupado[semana] = 0;
            agrupado[semana] += venda.valorTotal || 0;
        });

        return Object.entries(agrupado).map(([semana, valorTotal]) => ({
            semana,
            valorTotal
        }));
    },

    async vendasPorPneu(pneuId) {
        const snapshot = await itensRef.where('pneuId', '==', pneuId).get();

        let total = 0;

        snapshot.forEach(doc => {
            const item = doc.data();
            console.log('Item encontrado:', item);

            const quantidade = Number(item.quantidade) || 0;

            
            let valorUnitario = item.valorUnitario;

            if (typeof valorUnitario === 'string') {
                valorUnitario = parseFloat(valorUnitario.replace(',', '.'));
            } else {
                valorUnitario = Number(valorUnitario) || 0;
            }

            total += quantidade * valorUnitario;
        });

        const pneuDoc = await pneusRef.doc(pneuId).get();
        const pneu = pneuDoc.exists ? pneuDoc.data() : null;

        return {
            pneu: pneu ? `${pneu.marca} ${pneu.medida}` : 'Desconhecido',
            total: total.toFixed(2) 
        };
    },

    async pneusMaisVendidos() {
        const snapshot = await itensRef.get();

        const giro = {};

        snapshot.forEach(doc => {
            const item = doc.data();
            if (!giro[item.pneuId]) giro[item.pneuId] = 0;
            giro[item.pneuId] += item.quantidade || 0;
        });

        const resultados = await Promise.all(
            Object.entries(giro).map(async ([pneuId, quantidade]) => {
                const pneuDoc = await pneusRef.doc(pneuId).get();
                const pneu = pneuDoc.exists ? pneuDoc.data() : {};
                return {
                    pneu: pneu ? `${pneu.marca} ${pneu.medida}` : 'Desconhecido',
                    quantidade
                };
            })
        );

        resultados.sort((a, b) => b.quantidade - a.quantidade);

        return resultados;
    }
};