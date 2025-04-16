import { db } from '../config/firebase.js';
import { FieldPath, Timestamp } from 'firebase-admin/firestore'; 

export const obterRelatorioComFiltros = async (filtros) => {
  const { marca, medida } = filtros;

  const dataLimite = Timestamp.now().toMillis() - 7 * 24 * 60 * 60 * 1000;
  const dataInicioTimestamp = Timestamp.fromMillis(dataLimite);

  console.log("🔍 Buscando vendas a partir de:", dataInicioTimestamp.toDate());

  // 1. Buscar as vendas nos últimos 7 dias
  const vendasSnapshot = await db.collection('Vendas')
    .where('dataVenda', '>=', dataInicioTimestamp)
    .get();

  const vendasIds = vendasSnapshot.docs.map(doc => doc.id);
  console.log("📦 Vendas encontradas:", vendasIds.length, vendasIds);

  if (vendasIds.length === 0) return [];

  // 2. Buscar os itens de venda correspondentes
  const itensSnapshot = await db.collection('ItensVenda')
    .where('vendaId', 'in', vendasIds)
    .get();

  const pneusIds = [];
  const itens = [];

  itensSnapshot.docs.forEach(doc => {
    const item = doc.data();
    pneusIds.push(item.pneuId);
    itens.push(item);
  });

  console.log("🛞 ItensVenda encontrados:", itens.length);
  console.log("🔗 IDs de pneus:", pneusIds);

  if (pneusIds.length === 0) return [];

  // 3. Buscar os pneus dos itens vendidos — AJUSTE AQUI!
  const pneuSnapshot = await db.collection('Pneus')
    .where(FieldPath.documentId(), 'in', pneusIds)
    .get();

  const pneusMap = {};
  pneuSnapshot.docs.forEach(doc => {
    const pneu = doc.data();
    pneusMap[doc.id] = pneu; // usa doc.id
  });

  console.log("📋 Pneus encontrados:", Object.keys(pneusMap).length);

  // 4. Montar o relatório
  const relatorio = {};

  for (const item of itens) {
    const pneu = pneusMap[item.pneuId];
    if (!pneu) {
      console.log("❌ Pneu não encontrado para o item:", item.pneuId);
      continue;
    }

    // Filtros
    if (marca && pneu.marca !== marca) {
      console.log(`⚠️ Marca não bate: ${pneu.marca} !== ${marca}`);
      continue;
    }
    if (medida && pneu.medida !== medida) {
      console.log(`⚠️ Medida não bate: ${pneu.medida} !== ${medida}`);
      continue;
    }

    const chave = `${pneu.marca} ${pneu.medida}`;

    if (!relatorio[chave]) {
      relatorio[chave] = {
        marca: pneu.marca,
        medida: pneu.medida,
        quantidadeVendida: 0,
        valorTotal: 0
      };
    }

    relatorio[chave].quantidadeVendida += item.quantidade;
    relatorio[chave].valorTotal += item.quantidade * item.valorUnitario;
  }

  console.log("📊 Relatório final:", relatorio);

  return Object.values(relatorio);
};