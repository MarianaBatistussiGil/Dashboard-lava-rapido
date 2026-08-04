// Única fonte de números do modelo. Nenhum componente ou função de cálculo deve ter
// número hardcoded fora deste arquivo. Cada folha é { valor, min, max, unidade, fonte }.
// fonte: 'real' (levantamento do grupo) | 'estimado' (placeholder até a planilha)
//
// Ver README.md para a tabela de correspondência premissa -> linha da planilha.

export const premissasBase = {
  meta: {
    anoBase: 2025,
    anoInicioProjecao: 2026,
    anoFimProjecao: 2035,
  },

  operacional: {
    volumeAnualBase: {
      valor: 1580,
      min: 1200,
      max: 3000,
      unidade: "carros/ano",
      fonte: "real",
    },
    // carros/semana, real — soma bate com volumeAnualBase (135+156+210+249+339+491=1580)
    distribuicaoSemanal: {
      segunda: 135,
      terca: 156,
      quarta: 210,
      quinta: 249,
      sexta: 339,
      sabado: 491,
      domingo: 0, // fechado
    },
    // carros/mês, real (parte aproximada no levantamento original)
    sazonalidadeMensal: {
      jan: 110,
      fev: 76,
      mar: 105,
      abr: 132,
      mai: 150,
      jun: 141,
      jul: 145,
      ago: 172,
      set: 135,
      out: 144,
      nov: 160,
      dez: 184,
    },
    crescimentoDemandaAnual: {
      // ESTIMADO — substituir pela planilha. Reflete o efeito combinado do
      // agendamento via WhatsApp, portfólio ampliado e marketing (T0), não só
      // crescimento orgânico — por isso acima de inflação/população.
      valor: 0.12,
      min: 0,
      max: 0.25,
      unidade: "%/ano",
      fonte: "estimado",
    },
    diasUteisPorMes: {
      // ESTIMADO — substituir pela planilha
      valor: 26,
      min: 20,
      max: 30,
      unidade: "dias",
      fonte: "estimado",
    },
    horasUteisPorDia: {
      // ESTIMADO — substituir pela planilha
      valor: 9,
      min: 6,
      max: 12,
      unidade: "horas",
      fonte: "estimado",
    },
    boxesManuais: {
      asIs: { valor: 2, unidade: "boxes", fonte: "real" },
      t0: { valor: 2, unidade: "boxes", fonte: "real" },
      t1: { valor: 6, unidade: "boxes", fonte: "real" },
    },
  },

  tempoLavagem: {
    // min/carro, real — histórico individual, referência para o gráfico 5.
    // Nota: o organograma (T0) lista Wesley como um dos 6 lavadores ativos, mas o
    // histórico de tempos indica que ele saiu em dez/25. Mantido como está no
    // levantamento; headcount de folha usa os 6 cargos do organograma.
    historicoPorFuncionario: [
      { nome: "Val", min: 33.2, status: "ativo" },
      { nome: "Edson", min: 59.6, status: "ativo" },
      { nome: "Marcão", min: 63.1, status: "ativo" },
      { nome: "Douglas", min: 69.5, status: "ativo" },
      { nome: "Jaqueline", min: 72.0, status: "ativo" },
      { nome: "Moacir", min: 73.3, status: "ativo" },
      { nome: "Railson", min: 78.0, status: "ativo" },
      { nome: "Adilson", min: 84.0, status: "saiu dez/25" },
      { nome: "Wesley", min: 84.2, status: "saiu dez/25" },
      { nome: "Kelvin", min: 129.3, status: "entrou jan/26" },
      { nome: "Jhonatan", min: 137.6, status: "entrou jan/26" },
    ],
    mediaAtualEquipeAtiva: {
      valor: 79.5,
      unidade: "min/carro",
      fonte: "real",
    },
    tempoAlvoT0: {
      // ESTIMADO — meta de KPI (referência: DryWash faz em 30 min)
      valor: 30,
      min: 20,
      max: 79.5,
      unidade: "min/carro",
      fonte: "estimado",
    },
    anosParaAtingirMeta: {
      // ESTIMADO — substituir pela planilha
      valor: 3,
      min: 1,
      max: 6,
      unidade: "anos",
      fonte: "estimado",
    },
    curvaAdocao: {
      // 'linear' | 'logistica'
      valor: "linear",
      fonte: "estimado",
    },
  },

  // preço, tempo, custo variável e mix = ESTIMADO até a planilha chegar
  servicos: [
    {
      id: "manual-seca",
      nome: "Lavagem externa manual a seco",
      segmento: "B2C",
      disponivelEm: "T0",
      preco: { valor: 50, min: 35, max: 80, unidade: "R$", fonte: "estimado" },
      tempoExecucaoMin: { valor: 30, min: 15, max: 45, unidade: "min", fonte: "estimado" },
      custoVariavelUnitario: { valor: 8, min: 4, max: 15, unidade: "R$", fonte: "estimado" },
      // mix mais baixo no início: opção de entrada que ganha espaço aos poucos, sem
      // substituir de cara o serviço completo que domina o faturamento hoje
      participacaoMix: { valor: 0.2, min: 0, max: 1, unidade: "%", fonte: "estimado" },
    },
    {
      id: "rollover",
      nome: "Lavagem externa por rollover",
      segmento: "ambos",
      disponivelEm: "T1",
      preco: { valor: 45, min: 30, max: 75, unidade: "R$", fonte: "estimado" },
      // min/max reais (faixa da máquina); ponto usado no cálculo é estimado dentro da faixa
      tempoExecucaoMin: { valor: 6, min: 4, max: 7.5, unidade: "min", fonte: "real (faixa da máquina)" },
      custoVariavelUnitario: { valor: 10, min: 5, max: 20, unidade: "R$", fonte: "estimado" },
      participacaoMix: { valor: 0.15, min: 0, max: 1, unidade: "%", fonte: "estimado" },
    },
    {
      id: "completa",
      nome: "Lavagem completa (interna + externa)",
      segmento: "ambos",
      disponivelEm: "T0",
      // serviço único hoje (100% do faturamento no As-Is). tempoDinamico: o tempo real
      // desse serviço (79,5 min, média da equipe ativa) cai até a meta de 30 min
      // conforme a curva de adoção do treinamento — ver tempoLavagem.tempoAlvoT0.
      tempoDinamico: true,
      // 20 anos de reputação em Moema sustentam um ticket no topo da faixa do
      // concorrente de referência (Car Wash Moema: R$ 80-150)
      preco: { valor: 100, min: 70, max: 160, unidade: "R$", fonte: "estimado" },
      tempoExecucaoMin: { valor: 79.5, min: 30, max: 79.5, unidade: "min", fonte: "real (média equipe ativa)" },
      custoVariavelUnitario: { valor: 18, min: 10, max: 30, unidade: "R$", fonte: "estimado" },
      // hoje é 100% do faturamento (serviço único no As-Is); segue dominante em T0/T1,
      // só perde participação aos poucos para o portfólio novo
      participacaoMix: { valor: 0.55, min: 0, max: 1, unidade: "%", fonte: "estimado" },
    },
    {
      id: "polimento",
      nome: "Polimento",
      segmento: "B2C",
      disponivelEm: "T0",
      preco: { valor: 180, min: 100, max: 300, unidade: "R$", fonte: "estimado" },
      tempoExecucaoMin: { valor: 90, min: 60, max: 150, unidade: "min", fonte: "estimado" },
      custoVariavelUnitario: { valor: 40, min: 20, max: 70, unidade: "R$", fonte: "estimado" },
      participacaoMix: { valor: 0.06, min: 0, max: 1, unidade: "%", fonte: "estimado" },
    },
    {
      id: "cera",
      nome: "Cera protetora",
      segmento: "B2C",
      disponivelEm: "T0",
      preco: { valor: 70, min: 40, max: 120, unidade: "R$", fonte: "estimado" },
      tempoExecucaoMin: { valor: 20, min: 10, max: 30, unidade: "min", fonte: "estimado" },
      custoVariavelUnitario: { valor: 15, min: 8, max: 25, unidade: "R$", fonte: "estimado" },
      participacaoMix: { valor: 0.04, min: 0, max: 1, unidade: "%", fonte: "estimado" },
    },
  ],

  assinaturas: {
    planos: [
      {
        id: "essencial",
        nome: "Essencial",
        lavagensPorMes: 2,
        tipo: "só máquina (externa)",
        preco: { valor: 70, unidade: "R$/mês", fonte: "real" },
        penetracao: { valor: 0.05, min: 0, max: 0.5, unidade: "% da base", fonte: "estimado" },
      },
      {
        id: "premium",
        nome: "Premium",
        lavagensPorMes: 2,
        tipo: "máquina ou manual + interna",
        preco: { valor: 120, unidade: "R$/mês", fonte: "real" },
        penetracao: { valor: 0.08, min: 0, max: 0.5, unidade: "% da base", fonte: "estimado" },
      },
      {
        id: "premium-plus",
        nome: "Premium Plus",
        lavagensPorMes: 4,
        tipo: "máquina ou manual + interna + cera",
        preco: { valor: 180, unidade: "R$/mês", fonte: "real" },
        penetracao: { valor: 0.04, min: 0, max: 0.5, unidade: "% da base", fonte: "estimado" },
      },
    ],
    corporativa: {
      // ESTIMADO — substituir pela planilha
      preco: { valor: 250, min: 150, max: 400, unidade: "R$/mês", fonte: "estimado" },
      penetracao: { valor: 0.02, min: 0, max: 0.2, unidade: "% da base B2B", fonte: "estimado" },
    },
    // base de clientes ativos estimada sobre a qual as penetrações de plano incidem
    // (ordem de grandeza: 1.580 lavagens/ano / ~4 visitas médias por cliente/ano)
    baseClientesEstimada: {
      valor: 350,
      min: 150,
      max: 800,
      unidade: "clientes",
      fonte: "estimado",
    },
  },

  // qtd, salário mensal (R$), encargos (%) — todos ESTIMADO até a planilha chegar.
  // Calibrado para caber na receita de um negócio de ~1.580 lavagens/ano: Val,
  // Edson e Jaqueline (gerente/subgerente/atendente) já lavam carro hoje conforme o
  // histórico de tempos, então o "formal" aqui é a diferenciação de função dentro de
  // uma equipe pequena, não uma camada extra de salários de gestão de mercado.
  // Encargos em 20% supõe enquadramento Simples Nacional (bem abaixo do CLT cheio).
  equipe: {
    proprietario: { qtd: 1, salario: 1000, encargos: 0.0 },
    gerente: { qtd: 1, salario: 1500, encargos: 0.15 },
    subgerente: { qtd: 1, salario: 1300, encargos: 0.15 },
    auxAdministrativo: { qtd: 1, salario: 1100, encargos: 0.15 },
    atendente: { qtd: 1, salario: 1100, encargos: 0.15 },
    lavador: { qtd: 6, salario: 1200, encargos: 0.15 },
    operadorMaquina: { qtd: 1, salario: 1600, encargos: 0.15, disponivelEm: "T1" },
    contador: { qtd: 1, salario: 300, encargos: 0.0, tipo: "terceirizado" },
  },

  custos: {
    treinamentoPorFuncionario: {
      valor: 99,
      unidade: "R$/funcionário",
      fonte: "real",
    },
    aluguel: {
      // ESTIMADO — substituir pela planilha. Baixo porque o terreno é presumido
      // próprio (mais de 20 anos de operação); valor cobre IPTU/condomínio/manutenção.
      valor: 2000,
      min: 0,
      max: 10000,
      unidade: "R$/mês",
      fonte: "estimado",
    },
    despesasFixasOutras: {
      // ESTIMADO — substituir pela planilha
      valor: 1500,
      min: 800,
      max: 6000,
      unidade: "R$/mês",
      fonte: "estimado",
    },
    marketingMensal: {
      // ESTIMADO — substituir pela planilha
      valor: 1000,
      min: 500,
      max: 4000,
      unidade: "R$/mês",
      fonte: "estimado",
    },
  },

  maquina: {
    capex: {
      valor: 275000,
      min: 250000,
      max: 300000,
      unidade: "R$",
      fonte: "real",
    },
    // faixa real 8-15 veículos/hora; 11 é o ponto médio usado no cálculo (ajustável)
    veiculosHora: {
      valor: 11,
      min: 8,
      max: 15,
      unidade: "veículos/hora",
      fonte: "real (faixa) — 11 é o ponto médio",
    },
    economiaAgua: { valor: 0.9, unidade: "%", fonte: "real" },
    // null = automático (primeiro ano em que o caixa acumulado atinge o capex)
    anoAtivacao: {
      valor: null,
      min: 2026,
      max: 2035,
      unidade: "ano",
      fonte: "controle do usuário",
    },
    vidaUtilDepreciacao: {
      // ESTIMADO — substituir pela planilha
      valor: 10,
      min: 5,
      max: 15,
      unidade: "anos",
      fonte: "estimado",
    },
  },

  financeiro: {
    wacc: {
      // ESTIMADO — substituir pela planilha
      valor: 0.16,
      min: 0.1,
      max: 0.25,
      unidade: "%",
      fonte: "estimado",
    },
    crescimentoPerpetuidade: {
      // ESTIMADO — substituir pela planilha
      valor: 0.03,
      min: 0,
      max: 0.06,
      unidade: "%",
      fonte: "estimado",
    },
    aliquotaEfetiva: {
      // ESTIMADO — faixa Simples Nacional
      valor: 0.06,
      min: 0.04,
      max: 0.33,
      unidade: "%",
      fonte: "estimado",
    },
    capexManutencaoAnual: {
      // ESTIMADO — substituir pela planilha
      valor: 5000,
      min: 0,
      max: 20000,
      unidade: "R$",
      fonte: "estimado",
    },
    capitalGiroSobreReceita: {
      // ESTIMADO — substituir pela planilha
      valor: 0.03,
      min: 0,
      max: 0.1,
      unidade: "%",
      fonte: "estimado",
    },
    dividaLiquidaAtual: {
      // ESTIMADO — substituir pela planilha
      valor: 0,
      min: 0,
      max: 100000,
      unidade: "R$",
      fonte: "estimado",
    },
    caixaInicial: {
      // ESTIMADO — substituir pela planilha; ponto de partida do caixa acumulado
      valor: 20000,
      min: 0,
      max: 200000,
      unidade: "R$",
      fonte: "estimado",
    },
  },

  expansao: {
    // toggle opcional — matriz-filial em estacionamentos comerciais de Moema
    habilitada: { valor: false, fonte: "controle do usuário" },
    anoAtivacao: {
      valor: 2031,
      min: 2027,
      max: 2035,
      unidade: "ano",
      fonte: "estimado",
    },
    numeroFiliais: {
      valor: 1,
      min: 1,
      max: 3,
      unidade: "filiais",
      fonte: "estimado",
    },
    capexPorFilial: {
      valor: 60000,
      min: 30000,
      max: 100000,
      unidade: "R$",
      fonte: "estimado",
    },
    receitaMensalPorFilial: {
      valor: 15000,
      min: 8000,
      max: 25000,
      unidade: "R$/mês",
      fonte: "estimado",
    },
    custoMensalPorFilial: {
      valor: 9000,
      min: 5000,
      max: 18000,
      unidade: "R$/mês",
      fonte: "estimado",
    },
  },
};
