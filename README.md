# Nogueira · Valuation Suite

Dashboard web interativo de valuation do **Lava-Rápido Nogueira** — entregável de
tech do case da Insper Jr. (51ª Gestão, 2026.2, Grupo 1). Traduz em números o plano
de reestruturação operacional (T0), automação com a máquina Istobal M'Wash3 (T1) e
expansão matriz-filial já definidos pelo grupo, num modelo de DCF que reage em tempo
real a mais de 50 premissas ajustáveis.

**Stack**: Next.js 16 (App Router) + JavaScript, Tailwind CSS, Recharts. Sem banco de
dados, sem API routes, sem autenticação real — projetado para rodar 100% no client e
publicar na Vercel.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. Login (apenas ilustrativo, sem backend):

```
usuário: claudemir
senha:   lavarapido
```

Ou clique em **"Entrar em modo demo"** para pular direto ao dashboard.

```bash
npm run build   # build de produção
npm run start   # roda o build de produção localmente
```

## Como o modelo funciona

- **`src/data/premissas.js`** é a única fonte de números do projeto. Cada premissa é
  `{ valor, min, max, unidade, fonte }`, onde `fonte` é `'real'` (levantamento do
  grupo) ou `'estimado'` (placeholder, marcado com comentário
  `// ESTIMADO — substituir pela planilha`).
- **`src/lib/dcf.js`** é o motor de cálculo: funções puras, sem React, que recebem os
  valores já "achatados" por `extrairValores()` (a árvore de premissas sem os
  metadados de slider) e devolvem capacidade, demanda, receita, custos, DRE, FCFF e
  valuation.
- **`src/contexts/PremissasContext.js`** guarda o estado dos sliders (a árvore de
  premissas com metadados), recalcula tudo via `dcf.js` a cada mudança e expõe o
  resultado pelo hook `usePremissas()`.
- **Cenários**: `asIs` (congelado, o negócio como existe hoje — 100% lavagem
  completa, 2 boxes, 79,5 min/carro, sem assinatura, sem máquina, para sempre),
  `t0` (reestruturado — portfólio, assinaturas e tempo caindo até a meta —, mas sem
  máquina) e `t1` (o cenário "real": segue T0 até o ano de ativação da máquina,
  híbrido depois). As três chamam a mesma `projetarSerie()`; a fase (`asIs`/`T0`/`T1`)
  é um campo calculado por ano, não uma lógica de cálculo separada.
- **Ano de ativação da máquina**: por padrão, o primeiro ano em que o caixa acumulado
  da trajetória T0 (sem máquina) atinge o capex. Se isso nunca acontece dentro do
  horizonte 2026–2035, o modelo **não força a ativação** — T1 fica igual a T0 até que
  o usuário arraste o slider manualmente (financiamento externo, por exemplo). Forçar
  a ativação no último ano do horizonte jogaria o capex inteiro no ano que define o
  valor terminal e distorceria o Enterprise Value.

## Substituindo os dados estimados pela planilha

Toda premissa com `fonte: 'estimado'` em `src/data/premissas.js` deve ser trocada
pelo valor real da planilha financeira do grupo assim que ela ficar pronta — basta
editar o campo `valor` (e opcionalmente `min`/`max`, que definem o range do slider).
Nada mais no código precisa mudar: `dcf.js` e os componentes só leem a árvore de
premissas.

| Chave em `premissas.js` | O que é | Linha equivalente na planilha |
|---|---|---|
| `operacional.crescimentoDemandaAnual` | Crescimento de demanda ao ano | Taxa de crescimento de volume (receita/DRE projetada) |
| `operacional.diasUteisPorMes` / `horasUteisPorDia` | Capacidade operacional | Premissas de operação/calendário |
| `tempoLavagem.tempoAlvoT0` / `anosParaAtingirMeta` | Meta de tempo por lavagem e prazo | Cronograma de implantação T0 |
| `servicos[].preco` | Preço de cada serviço avulso | Tabela de preços por serviço |
| `servicos[].custoVariavelUnitario` | Custo variável por serviço | Custo de insumos por lavagem |
| `servicos[].participacaoMix` | Participação de cada serviço no faturamento | Mix de receita projetado |
| `assinaturas.corporativa.*` / `baseClientesEstimada` | Assinatura B2B e base de clientes | Premissas de assinatura/CRM |
| `equipe.*.qtd` / `equipe.*.salario` | Headcount e salário por função | Folha de pagamento (DRE) |
| `custos.aluguel` / `despesasFixasOutras` / `marketingMensal` | Custos fixos mensais | DRE — despesas fixas |
| `maquina.vidaUtilDepreciacao` | Vida útil da máquina | Política de depreciação |
| `financeiro.wacc` | Taxa de desconto | WACC calculado |
| `financeiro.crescimentoPerpetuidade` | g da perpetuidade | Premissa de perpetuidade (Gordon) |
| `financeiro.aliquotaEfetiva` | Alíquota efetiva de imposto | Regime tributário |
| `financeiro.capexManutencaoAnual` / `capitalGiroSobreReceita` | Capex de manutenção e capital de giro | DRE / Balanço projetado |
| `financeiro.dividaLiquidaAtual` / `caixaInicial` | Dívida líquida e caixa inicial | Balanço patrimonial atual |
| `expansao.*` | Premissas da expansão matriz-filial | Plano de expansão (se/quando modelado na planilha) |

Premissas marcadas `fonte: 'real'` (volume anual, distribuição semanal/mensal,
tempos de lavagem por funcionário, preços de assinatura, capex e faixa de
velocidade da máquina, economia de água, custo do treinamento) já vêm do
levantamento do grupo e não precisam de ajuste — mas podem ser atualizadas aqui se
o levantamento mudar.

## Deploy

Guiado via Vercel — ver instruções no fim da conversa de desenvolvimento, ou:

```bash
npx vercel
```

Não há variáveis de ambiente obrigatórias.
