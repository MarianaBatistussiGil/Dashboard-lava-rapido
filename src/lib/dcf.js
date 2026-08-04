// Motor de cálculo do valuation — funções puras, sem React e sem I/O.
// Todo número de negócio vem de src/data/premissas.js; nada aqui é hardcoded.
//
// Cenários: 'asIs' (congelado, hoje), 't0' (reestruturado, máquina nunca entra) e
// 't1' (t0 até anoAtivacaoMaquina, híbrido depois). Fase ('asIs'|'T0'|'T1') é um
// resultado por ano, não um branch de cálculo separado.

// ---------------------------------------------------------------------------
// Premissas -> valores puros
// ---------------------------------------------------------------------------

export function extrairValores(node) {
  if (node === null || typeof node !== "object") return node;
  if (Array.isArray(node)) return node.map(extrairValores);
  if (Object.prototype.hasOwnProperty.call(node, "valor")) return node.valor;
  const resultado = {};
  for (const [chave, valor] of Object.entries(node)) {
    resultado[chave] = extrairValores(valor);
  }
  return resultado;
}

// ---------------------------------------------------------------------------
// Capacidade
// ---------------------------------------------------------------------------

export function capacidadeManualAnual({ boxes, horasUteisPorDia, diasUteisPorMes, tempoMedioLavagemMin }) {
  const diasUteisAno = diasUteisPorMes * 12;
  const minutosDisponiveis = boxes * horasUteisPorDia * 60 * diasUteisAno;
  return minutosDisponiveis / tempoMedioLavagemMin;
}

export function capacidadeAutomatizadaAnual({ veiculosHora, horasUteisPorDia, diasUteisPorMes }) {
  const diasUteisAno = diasUteisPorMes * 12;
  return veiculosHora * horasUteisPorDia * diasUteisAno;
}

// Razão pico/média da demanda semanal real (ex.: sábado muito acima da média dos
// dias operacionais). Derata a capacidade teórica porque não dá pra deslocar a fila
// de sábado para a segunda-feira — a folga no meio da semana não socorre o pico.
export function fatorConcentracaoSemanal(distribuicaoSemanal) {
  const dias = Object.values(distribuicaoSemanal);
  const diasOperacionais = dias.filter((v) => v > 0).length || 1;
  const total = dias.reduce((acc, v) => acc + v, 0);
  if (total === 0) return 1;
  const pico = Math.max(...dias);
  const mediaPorDiaOperacional = total / diasOperacionais;
  return mediaPorDiaOperacional > 0 ? pico / mediaPorDiaOperacional : 1;
}

export function capacidadeTotalAnual({
  fase,
  boxes,
  veiculosHora,
  horasUteisPorDia,
  diasUteisPorMes,
  tempoMedioLavagemMin,
  fatorConcentracao = 1,
}) {
  const manual =
    capacidadeManualAnual({ boxes, horasUteisPorDia, diasUteisPorMes, tempoMedioLavagemMin }) /
    fatorConcentracao;
  const automatizada =
    fase === "T1" ? capacidadeAutomatizadaAnual({ veiculosHora, horasUteisPorDia, diasUteisPorMes }) : 0;
  return manual + automatizada;
}

// ---------------------------------------------------------------------------
// Tempo de lavagem (curva de adoção até a meta)
// ---------------------------------------------------------------------------

function progressoLogistico(x) {
  const k = 10;
  const shift = 0.5;
  const raw = 1 / (1 + Math.exp(-k * (x - shift)));
  const min = 1 / (1 + Math.exp(-k * (0 - shift)));
  const max = 1 / (1 + Math.exp(-k * (1 - shift)));
  return (raw - min) / (max - min);
}

export function tempoMedioLavagemNoAno({ ano, anoBase, tempoInicial, tempoAlvo, anosParaAtingirMeta, curva = "linear" }) {
  const anosDecorridos = Math.max(0, ano - anoBase);
  const progresso = Math.min(1, anosParaAtingirMeta > 0 ? anosDecorridos / anosParaAtingirMeta : 1);
  const fator = curva === "logistica" ? progressoLogistico(progresso) : progresso;
  return tempoInicial - (tempoInicial - tempoAlvo) * fator;
}

// ---------------------------------------------------------------------------
// Demanda e atendimento
// ---------------------------------------------------------------------------

export function volumeDemandaAnual({ ano, anoBase, volumeBase, crescimentoAnual }) {
  const anos = ano - anoBase;
  return volumeBase * Math.pow(1 + crescimentoAnual, anos);
}

// Assinatura tem prioridade sobre avulso (é receita contratada mensalmente, não
// perdida por um pico pontual de fila); o que sobra de capacidade atende avulso.
// Receita perdida só é contada sobre a fração avulsa não atendida.
export function volumeAtendidoEReceitaPerdida({
  volumeAvulsoDemandado,
  volumeAssinaturaDemandado,
  capacidadeTotal,
  precoMedioAvulso,
}) {
  const assinaturaAtendida = Math.min(volumeAssinaturaDemandado, capacidadeTotal);
  const capacidadeRestante = Math.max(0, capacidadeTotal - assinaturaAtendida);
  const avulsoAtendido = Math.min(volumeAvulsoDemandado, capacidadeRestante);
  const volumeAtendido = assinaturaAtendida + avulsoAtendido;
  const volumeExcedente = Math.max(0, volumeAvulsoDemandado + volumeAssinaturaDemandado - volumeAtendido);
  const receitaPerdida = Math.max(0, volumeAvulsoDemandado - avulsoAtendido) * precoMedioAvulso;
  return { volumeAtendido, volumeExcedente, receitaPerdida, avulsoAtendido, assinaturaAtendida };
}

export function ocupacaoCapacidade({ volumeAtendido, capacidadeTotal }) {
  return capacidadeTotal > 0 ? volumeAtendido / capacidadeTotal : 0;
}

// ---------------------------------------------------------------------------
// Portfólio de serviços
// ---------------------------------------------------------------------------

// Redistribui participacaoMix proporcionalmente entre os demais serviços ao mudar um.
export function normalizarMix(servicos, idAlterado, novoValor) {
  const alvo = servicos.find((s) => s.id === idAlterado);
  if (!alvo) return servicos;
  const novoValorClamped = Math.min(1, Math.max(0, novoValor));
  const somaOutros = servicos.reduce((acc, s) => (s.id === idAlterado ? acc : acc + s.participacaoMix), 0);
  const restante = 1 - novoValorClamped;
  return servicos.map((s) => {
    if (s.id === idAlterado) return { ...s, participacaoMix: novoValorClamped };
    if (somaOutros <= 0) {
      const demaisCount = servicos.length - 1;
      return { ...s, participacaoMix: demaisCount > 0 ? restante / demaisCount : 0 };
    }
    return { ...s, participacaoMix: (s.participacaoMix / somaOutros) * restante };
  });
}

// Serviços elegíveis numa fase, com o mix renormalizado para somar 1 entre eles.
export function servicosDisponiveis(servicos, fase) {
  const disponiveis = servicos.filter((s) => s.disponivelEm === "T0" || fase === "T1");
  const somaMix = disponiveis.reduce((acc, s) => acc + s.participacaoMix, 0) || 1;
  return disponiveis.map((s) => ({ ...s, participacaoMix: s.participacaoMix / somaMix }));
}

// Subconjunto que disputa os boxes manuais (exclui o rollover, que usa a máquina).
export function servicosManuais(servicosDisp) {
  const manuais = servicosDisp.filter((s) => s.id !== "rollover");
  const somaMix = manuais.reduce((acc, s) => acc + s.participacaoMix, 0) || 1;
  return manuais.map((s) => ({ ...s, participacaoMix: s.participacaoMix / somaMix }));
}

export function precoMedioPonderado(servicosDisp) {
  return servicosDisp.reduce((acc, s) => acc + s.participacaoMix * s.preco, 0);
}

export function custoVariavelMedioPonderado(servicosDisp) {
  return servicosDisp.reduce((acc, s) => acc + s.participacaoMix * s.custoVariavelUnitario, 0);
}

export function receitaPorServico({ volumeAvulsoAtendido, servicosDisp }) {
  const porServico = servicosDisp.map((s) => ({
    id: s.id,
    nome: s.nome,
    receita: volumeAvulsoAtendido * s.participacaoMix * s.preco,
  }));
  const total = porServico.reduce((acc, s) => acc + s.receita, 0);
  return { porServico, total };
}

// Custo variável aplicado ao volume total atendido (avulso + assinatura): o
// material/insumo custa o mesmo independente de como a lavagem foi vendida.
export function custosVariaveisTotais({ volumeAtendidoTotal, servicosDisp }) {
  return volumeAtendidoTotal * custoVariavelMedioPonderado(servicosDisp);
}

// ---------------------------------------------------------------------------
// Assinaturas
// ---------------------------------------------------------------------------

// progressoAdocao (0-1) reaproveita a mesma curva de maturação de T0 usada no tempo
// de lavagem — penetração de assinatura também é algo que se constrói ao longo dos
// primeiros anos, não um degrau instantâneo.
export function receitaAssinaturas({ planos, corporativa, baseClientesEstimada, progressoAdocao = 1 }) {
  const porPlano = planos.map((p) => {
    const assinantes = baseClientesEstimada * p.penetracao * progressoAdocao;
    const receita = assinantes * p.preco * 12;
    return { id: p.id, nome: p.nome, assinantes, receita };
  });
  const assinantesCorp = baseClientesEstimada * corporativa.penetracao * progressoAdocao;
  const receitaCorp = assinantesCorp * corporativa.preco * 12;
  const total = porPlano.reduce((acc, p) => acc + p.receita, 0) + receitaCorp;
  return { porPlano, corporativa: { assinantes: assinantesCorp, receita: receitaCorp }, total };
}

export function volumeAssinaturaAnual({ planos, baseClientesEstimada, progressoAdocao = 1 }) {
  return planos.reduce(
    (acc, p) => acc + baseClientesEstimada * p.penetracao * progressoAdocao * p.lavagensPorMes * 12,
    0
  );
}

// ---------------------------------------------------------------------------
// Folha e custos fixos
// ---------------------------------------------------------------------------

export function folhaPagamento({ equipe, fase }) {
  const porCargo = Object.entries(equipe)
    .filter(([, c]) => !c.disponivelEm || (c.disponivelEm === "T1" && fase === "T1"))
    .map(([cargo, c]) => ({
      cargo,
      qtd: c.qtd,
      custoMensal: c.qtd * c.salario * (1 + c.encargos),
    }));
  const totalMensal = porCargo.reduce((acc, c) => acc + c.custoMensal, 0);
  return { porCargo, total: totalMensal * 12 };
}

// Custo único do curso de especialização, pago no ano em que T0 começa (2026),
// para todo o quadro já existente (o operador de máquina ainda não foi contratado).
export function custoTreinamento({ equipe, treinamentoPorFuncionario, ano, anoInicioProjecao }) {
  if (ano !== anoInicioProjecao) return 0;
  const headcountT0 = Object.values(equipe)
    .filter((c) => !c.disponivelEm)
    .reduce((acc, c) => acc + c.qtd, 0);
  return headcountT0 * treinamentoPorFuncionario;
}

export function custosFixosAnuais({ aluguel, despesasFixasOutras, marketingMensal }) {
  return (aluguel + despesasFixasOutras + marketingMensal) * 12;
}

// ---------------------------------------------------------------------------
// DRE / fluxo de caixa (um ano)
// ---------------------------------------------------------------------------

export function calcularEbitda({ receitaTotal, custosVariaveis, folha, custosFixos }) {
  return receitaTotal - custosVariaveis - folha - custosFixos;
}

export function calcularDepreciacao({ capexMaquina, vidaUtilDepreciacao, anoAtivacaoMaquina, ano }) {
  if (anoAtivacaoMaquina == null || ano < anoAtivacaoMaquina) return 0;
  const anosDesdeAtivacao = ano - anoAtivacaoMaquina;
  if (anosDesdeAtivacao >= vidaUtilDepreciacao) return 0;
  return capexMaquina / vidaUtilDepreciacao;
}

export function calcularEbit({ ebitda, depreciacao }) {
  return ebitda - depreciacao;
}

export function calcularNopat({ ebit, aliquotaEfetiva }) {
  return ebit * (1 - aliquotaEfetiva);
}

export function calcularFcff({ nopat, depreciacao, capex, variacaoCapitalGiro }) {
  return nopat + depreciacao - capex - variacaoCapitalGiro;
}

// ---------------------------------------------------------------------------
// Projeção anual consolidada
// ---------------------------------------------------------------------------

// As-Is: configuração congelada — só a lavagem completa (100% do mix real de hoje),
// tempo fixo em 79,5 min, 2 boxes, sem assinatura, sem marketing formal, sem máquina.
function projetarAnoAsIs({ ano, valores }) {
  const { meta, operacional, tempoLavagem, servicos, equipe, custos, financeiro } = valores;
  const completa = servicos.find((s) => s.id === "completa");
  const anoBaseDemanda = meta.anoInicioProjecao;

  const volumeDemandado = volumeDemandaAnual({
    ano,
    anoBase: anoBaseDemanda,
    volumeBase: operacional.volumeAnualBase,
    crescimentoAnual: operacional.crescimentoDemandaAnual,
  });

  const fatorConcentracao = fatorConcentracaoSemanal(operacional.distribuicaoSemanal);
  const capacidadeTotal =
    capacidadeManualAnual({
      boxes: operacional.boxesManuais.asIs,
      horasUteisPorDia: operacional.horasUteisPorDia,
      diasUteisPorMes: operacional.diasUteisPorMes,
      tempoMedioLavagemMin: tempoLavagem.mediaAtualEquipeAtiva,
    }) / fatorConcentracao;

  const { volumeAtendido, volumeExcedente, receitaPerdida } = volumeAtendidoEReceitaPerdida({
    volumeAvulsoDemandado: volumeDemandado,
    volumeAssinaturaDemandado: 0,
    capacidadeTotal,
    precoMedioAvulso: completa.preco,
  });

  const receitaTotal = volumeAtendido * completa.preco;
  const custosVariaveis = volumeAtendido * completa.custoVariavelUnitario;
  const folha = folhaPagamento({ equipe, fase: "T0" }); // mesmo time, sem operador de máquina
  const fixos = custosFixosAnuais({
    aluguel: custos.aluguel,
    despesasFixasOutras: custos.despesasFixasOutras,
    marketingMensal: 0, // sem marketing formal no As-Is
  });
  const custosTotais = custosVariaveis + folha.total + fixos;
  const ebitda = calcularEbitda({ receitaTotal, custosVariaveis, folha: folha.total, custosFixos: fixos });
  const ebit = calcularEbit({ ebitda, depreciacao: 0 });
  const nopat = calcularNopat({ ebit, aliquotaEfetiva: financeiro.aliquotaEfetiva });

  return {
    ano,
    fase: "asIs",
    volumeDemandado,
    volumeAtendido,
    volumeExcedente,
    receitaPerdida,
    capacidadeTotal,
    receita: {
      porServico: [{ id: completa.id, nome: completa.nome, receita: receitaTotal }],
      assinatura: { porPlano: [], corporativa: { assinantes: 0, receita: 0 }, total: 0 },
      total: receitaTotal,
    },
    custos: { variaveis: custosVariaveis, folha: folha.total, fixos, treinamento: 0, total: custosTotais },
    ebitda,
    depreciacao: 0,
    ebit,
    nopat,
    capex: financeiro.capexManutencaoAnual,
  };
}

function projetarAnoOperacional({ ano, valores, fase, anoAtivacaoMaquina }) {
  const { meta, operacional, tempoLavagem, assinaturas, equipe, custos, maquina, financeiro, expansao } = valores;
  const anoBaseDemanda = meta.anoInicioProjecao;

  const volumeAvulsoDemandado = volumeDemandaAnual({
    ano,
    anoBase: anoBaseDemanda,
    volumeBase: operacional.volumeAnualBase,
    crescimentoAnual: operacional.crescimentoDemandaAnual,
  });

  const progressoAdocao = Math.min(
    1,
    Math.max(0, tempoLavagem.anosParaAtingirMeta > 0 ? (ano - anoBaseDemanda) / tempoLavagem.anosParaAtingirMeta : 1)
  );

  const volumeAssinaturaDemandado = volumeAssinaturaAnual({
    planos: assinaturas.planos,
    baseClientesEstimada: assinaturas.baseClientesEstimada,
    progressoAdocao,
  });

  const servicosDisp = servicosDisponiveis(valores.servicos, fase);
  const servicosManuaisDisp = servicosManuais(servicosDisp);

  const tempoMedioManual = servicosManuaisDisp.reduce((acc, s) => {
    const tempo = s.tempoDinamico
      ? tempoMedioLavagemNoAno({
          ano,
          anoBase: anoBaseDemanda,
          tempoInicial: s.tempoExecucaoMin,
          tempoAlvo: tempoLavagem.tempoAlvoT0,
          anosParaAtingirMeta: tempoLavagem.anosParaAtingirMeta,
          curva: tempoLavagem.curvaAdocao,
        })
      : s.tempoExecucaoMin;
    return acc + s.participacaoMix * tempo;
  }, 0);

  const fatorConcentracao = fatorConcentracaoSemanal(operacional.distribuicaoSemanal);
  const boxes = fase === "T1" ? operacional.boxesManuais.t1 : operacional.boxesManuais.t0;

  const capacidadeTotal = capacidadeTotalAnual({
    fase,
    boxes,
    veiculosHora: maquina.veiculosHora,
    horasUteisPorDia: operacional.horasUteisPorDia,
    diasUteisPorMes: operacional.diasUteisPorMes,
    tempoMedioLavagemMin: tempoMedioManual,
    fatorConcentracao,
  });

  const precoMedioAvulso = precoMedioPonderado(servicosDisp);

  const { volumeAtendido, volumeExcedente, receitaPerdida, avulsoAtendido } = volumeAtendidoEReceitaPerdida({
    volumeAvulsoDemandado,
    volumeAssinaturaDemandado,
    capacidadeTotal,
    precoMedioAvulso,
  });

  const { porServico, total: receitaAvulso } = receitaPorServico({
    volumeAvulsoAtendido: avulsoAtendido,
    servicosDisp,
  });
  const receitaAssin = receitaAssinaturas({
    planos: assinaturas.planos,
    corporativa: assinaturas.corporativa,
    baseClientesEstimada: assinaturas.baseClientesEstimada,
    progressoAdocao,
  });

  const expansaoAtiva = expansao.habilitada && ano >= expansao.anoAtivacao;
  const receitaExpansao = expansaoAtiva ? expansao.receitaMensalPorFilial * expansao.numeroFiliais * 12 : 0;
  const custoExpansao = expansaoAtiva ? expansao.custoMensalPorFilial * expansao.numeroFiliais * 12 : 0;

  const receitaTotal = receitaAvulso + receitaAssin.total + receitaExpansao;

  const custosVariaveis = custosVariaveisTotais({ volumeAtendidoTotal: volumeAtendido, servicosDisp });
  const folha = folhaPagamento({ equipe, fase });
  const treinamento = custoTreinamento({
    equipe,
    treinamentoPorFuncionario: custos.treinamentoPorFuncionario,
    ano,
    anoInicioProjecao: meta.anoInicioProjecao,
  });
  const fixos = custosFixosAnuais({
    aluguel: custos.aluguel,
    despesasFixasOutras: custos.despesasFixasOutras,
    marketingMensal: custos.marketingMensal,
  });

  const custosTotais = custosVariaveis + folha.total + treinamento + fixos + custoExpansao;

  const ebitda = calcularEbitda({
    receitaTotal,
    custosVariaveis,
    folha: folha.total,
    custosFixos: treinamento + fixos + custoExpansao,
  });
  const depreciacao = calcularDepreciacao({
    capexMaquina: maquina.capex,
    vidaUtilDepreciacao: maquina.vidaUtilDepreciacao,
    anoAtivacaoMaquina,
    ano,
  });
  const ebit = calcularEbit({ ebitda, depreciacao });
  const nopat = calcularNopat({ ebit, aliquotaEfetiva: financeiro.aliquotaEfetiva });

  let capex = financeiro.capexManutencaoAnual;
  if (anoAtivacaoMaquina != null && ano === anoAtivacaoMaquina) capex += maquina.capex;
  if (expansao.habilitada && ano === expansao.anoAtivacao) capex += expansao.capexPorFilial * expansao.numeroFiliais;

  return {
    ano,
    fase,
    volumeDemandado: volumeAvulsoDemandado + volumeAssinaturaDemandado,
    volumeAtendido,
    volumeExcedente,
    receitaPerdida,
    capacidadeTotal,
    receita: { porServico, assinatura: receitaAssin, total: receitaTotal },
    custos: { variaveis: custosVariaveis, folha: folha.total, fixos, treinamento, total: custosTotais },
    ebitda,
    depreciacao,
    ebit,
    nopat,
    capex,
  };
}

export function projetarAno({ ano, valores, cenario, anoAtivacaoMaquina }) {
  if (cenario === "asIs") return projetarAnoAsIs({ ano, valores });
  const fase =
    cenario === "t0" ? "T0" : anoAtivacaoMaquina != null && ano >= anoAtivacaoMaquina ? "T1" : "T0";
  return projetarAnoOperacional({
    ano,
    valores,
    fase,
    anoAtivacaoMaquina: cenario === "t0" ? null : anoAtivacaoMaquina,
  });
}

export function projetarSerie({ valores, cenario, anoInicio, anoFim, anoAtivacaoMaquina }) {
  const resultado = [];
  let receitaAnterior = 0;
  for (let ano = anoInicio; ano <= anoFim; ano++) {
    const anoDado = projetarAno({ ano, valores, cenario, anoAtivacaoMaquina });
    const variacaoCapitalGiro = valores.financeiro.capitalGiroSobreReceita * (anoDado.receita.total - receitaAnterior);
    const fcff = calcularFcff({
      nopat: anoDado.nopat,
      depreciacao: anoDado.depreciacao,
      capex: anoDado.capex,
      variacaoCapitalGiro,
    });
    receitaAnterior = anoDado.receita.total;
    resultado.push({ ...anoDado, variacaoCapitalGiro, fcff });
  }
  return resultado;
}

// ---------------------------------------------------------------------------
// Valuation
// ---------------------------------------------------------------------------

export function valorPresente({ valorFuturo, wacc, anos }) {
  return valorFuturo / Math.pow(1 + wacc, anos);
}

export function valorTerminal({ fcffUltimoAno, wacc, g }) {
  return (fcffUltimoAno * (1 + g)) / (wacc - g);
}

export function enterpriseValue({ serie, wacc, g }) {
  const anoInicio = serie[0].ano;
  const fcffDescontados = serie.map((anoDado) => ({
    ano: anoDado.ano,
    valor: valorPresente({ valorFuturo: anoDado.fcff, wacc, anos: anoDado.ano - anoInicio + 1 }),
  }));
  const somaFcffDescontados = fcffDescontados.reduce((acc, f) => acc + f.valor, 0);
  const ultimoAno = serie[serie.length - 1];
  const vt = valorTerminal({ fcffUltimoAno: ultimoAno.fcff, wacc, g });
  const valorTerminalDescontado = valorPresente({ valorFuturo: vt, wacc, anos: serie.length });
  return {
    fcffDescontados,
    valorTerminalDescontado,
    enterpriseValue: somaFcffDescontados + valorTerminalDescontado,
  };
}

export function equityValue({ enterpriseValue, dividaLiquida }) {
  return enterpriseValue - dividaLiquida;
}

// ---------------------------------------------------------------------------
// VPL / TIR e métricas de decisão
// ---------------------------------------------------------------------------

function valorPresenteLiquido(taxa, fluxos) {
  return fluxos.reduce((acc, fc, t) => acc + fc / Math.pow(1 + taxa, t), 0);
}

function calcularTir(fluxos, chuteInicial = 0.1) {
  let taxa = chuteInicial;
  for (let i = 0; i < 100; i++) {
    const valor = valorPresenteLiquido(taxa, fluxos);
    const delta = 1e-6;
    const derivada = (valorPresenteLiquido(taxa + delta, fluxos) - valor) / delta;
    if (Math.abs(derivada) < 1e-9) break;
    const proximaTaxa = taxa - valor / derivada;
    if (!Number.isFinite(proximaTaxa)) return null;
    if (Math.abs(proximaTaxa - taxa) < 1e-7) return proximaTaxa;
    taxa = proximaTaxa;
  }
  return Number.isFinite(taxa) ? taxa : null;
}

export function vplTir({ investimentoInicial, fluxosCaixa, wacc }) {
  const fluxos = [-investimentoInicial, ...fluxosCaixa];
  return { vpl: valorPresenteLiquido(wacc, fluxos), tir: calcularTir(fluxos) };
}

// VPL/TIR isolado de cada decisão, por diferença entre séries sucessivas — o capex
// de cada etapa já está embutido no FCFF do ano em que ela acontece, então o
// investimento inicial aqui é 0 (evita contar o capex duas vezes).
export function vplTirPorDecisao({ valores, anoAtivacaoMaquina }) {
  const anoInicio = valores.meta.anoInicioProjecao;
  const anoFim = valores.meta.anoFimProjecao;
  const wacc = valores.financeiro.wacc;

  const serieAsIs = projetarSerie({ valores, cenario: "asIs", anoInicio, anoFim });
  const serieT0 = projetarSerie({ valores, cenario: "t0", anoInicio, anoFim });
  const valoresSemExpansao = { ...valores, expansao: { ...valores.expansao, habilitada: false } };
  const serieT1 = projetarSerie({ valores: valoresSemExpansao, cenario: "t1", anoInicio, anoFim, anoAtivacaoMaquina });
  const serieExpansao = valores.expansao.habilitada
    ? projetarSerie({ valores, cenario: "t1", anoInicio, anoFim, anoAtivacaoMaquina })
    : serieT1;

  const incremento = (base, comparada) => comparada.map((anoDado, i) => anoDado.fcff - base[i].fcff);

  return {
    t0: vplTir({ investimentoInicial: 0, fluxosCaixa: incremento(serieAsIs, serieT0), wacc }),
    t1: vplTir({ investimentoInicial: 0, fluxosCaixa: incremento(serieT0, serieT1), wacc }),
    expansao: vplTir({ investimentoInicial: 0, fluxosCaixa: incremento(serieT1, serieExpansao), wacc }),
  };
}

// Anos desde a ativação da máquina até o fluxo incremental (T1 - T0) acumulado
// zerar o capex embutido no ano de ativação.
export function paybackMaquina({ serieT0, serieT1, anoAtivacaoMaquina }) {
  const fluxosIncrementais = serieT1
    .map((anoT1, i) => ({ ano: anoT1.ano, incremento: anoT1.fcff - serieT0[i].fcff }))
    .filter((f) => f.ano >= anoAtivacaoMaquina);

  let acumulado = 0;
  for (let i = 0; i < fluxosIncrementais.length; i++) {
    const anterior = acumulado;
    acumulado += fluxosIncrementais[i].incremento;
    if (acumulado >= 0) {
      const fracaoDoAno =
        fluxosIncrementais[i].incremento !== 0 ? -anterior / fluxosIncrementais[i].incremento : 0;
      return i + Math.max(0, Math.min(1, fracaoDoAno));
    }
  }
  return null; // não recupera o investimento dentro do horizonte projetado
}

export function breakEvenCarrosDia({ custosFixosAnuais, precoMedio, custoVariavelMedio, diasUteisAno }) {
  const margemContribuicao = precoMedio - custoVariavelMedio;
  if (margemContribuicao <= 0) return null;
  const carrosAno = custosFixosAnuais / margemContribuicao;
  return carrosAno / diasUteisAno;
}

// ---------------------------------------------------------------------------
// Sensibilidade
// ---------------------------------------------------------------------------

export function matrizSensibilidade({ valores, waccRange, gRange, anoAtivacaoMaquina }) {
  const serie = projetarSerie({
    valores,
    cenario: "t1",
    anoInicio: valores.meta.anoInicioProjecao,
    anoFim: valores.meta.anoFimProjecao,
    anoAtivacaoMaquina,
  });
  const resultado = [];
  for (const wacc of waccRange) {
    for (const g of gRange) {
      const ev = enterpriseValue({ serie, wacc, g });
      const eq = equityValue({ enterpriseValue: ev.enterpriseValue, dividaLiquida: valores.financeiro.dividaLiquidaAtual });
      resultado.push({ wacc, g, equityValue: eq });
    }
  }
  return resultado;
}

// ---------------------------------------------------------------------------
// Caixa acumulado e ativação automática da máquina
// ---------------------------------------------------------------------------

export function caixaAcumulado({ serie, caixaInicial }) {
  let acumulado = caixaInicial;
  return serie.map((anoDado) => {
    acumulado += anoDado.fcff;
    return { ano: anoDado.ano, caixa: acumulado };
  });
}

// Default do ano de ativação da máquina: primeiro ano em que o caixa acumulado da
// trajetória T0 (sem máquina) atinge o capex da máquina.
export function anoAtivacaoAutomatico({ serieSemMaquina, capexMaquina, caixaInicial }) {
  const caixa = caixaAcumulado({ serie: serieSemMaquina, caixaInicial });
  const anoAlvo = caixa.find((c) => c.caixa >= capexMaquina);
  return anoAlvo ? anoAlvo.ano : null;
}
