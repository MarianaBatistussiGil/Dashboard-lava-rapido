@AGENTS.md

# Nogueira Valuation Suite

Dashboard de DCF interativo para o case do Lava-Rápido Nogueira (Insper Jr.). Ver
`README.md` para visão geral, como rodar e a tabela premissa → planilha.

## Stack

Next.js 16 (App Router, Turbopack), JavaScript puro (sem TypeScript), Tailwind CSS,
Recharts. Sem backend: sem banco, sem API routes, sem autenticação real. Deploy alvo:
Vercel.

## Regras do projeto

- **Toda premissa numérica vive em `src/data/premissas.js`.** Nenhum componente ou
  função pode ter número de negócio hardcoded. Cada folha é
  `{ valor, min, max, unidade, fonte }` (`fonte`: `'real'` | `'estimado'`).
- **Toda a matemática do valuation vive em `src/lib/dcf.js`**, como funções puras
  (sem React, sem `window`/`sessionStorage`). `extrairValores()` é o único ponto que
  converte a árvore de premissas (com metadados) em números puros para o resto de
  `dcf.js` consumir — por isso qualquer campo novo em `premissas.js` já wrapado em
  `{ valor, ... }` funciona automaticamente em todo o motor, sem tocar em `dcf.js`.
- **Paleta da marca**: vermelho vinho + preto + branco, só isso (ver
  `tailwind.config.js` → `ink.*` e `wine.*`, e `src/lib/chartTheme.js` para a
  aplicação em gráficos). É uma decisão de produto explícita do usuário — não
  introduzir outras cores de destaque. (O projeto passou brevemente por uma paleta
  azul extraída da logo real em `src/app/assets/image.png`, mas o usuário pediu para
  voltar a vermelho-vinho; a logo em si continua azul, é só uma imagem.)
- **Cenários** (`asIs` / `t0` / `t1`) são um campo `fase` calculado por ano dentro de
  `projetarAno`, não uma ramificação de lógica separada. Ver comentário no topo de
  `dcf.js`.
- Login é **simbólico** (`src/lib/auth.js`, credenciais fixas + `sessionStorage`) —
  não é segurança real e não deve virar uma. É exigência do enunciado ter uma tela de
  login com credenciais visíveis.

## Estado atual

As três etapas do plano original foram implementadas:

1. **Motor + dados** — `premissas.js` e `dcf.js` completos; defaults `estimado`
   calibrados manualmente (via script de sanity-check descartável, não commitado)
   para que EBITDA/caixa tenham uma trajetória plausível ao longo de 2026–2035.
2. **Landing + login** — paleta premium vinho/preto/branco, `LoginCard` e `Headline`
   client-only, guard de autenticação em `/dashboard`.
3. **Dashboard** — `PremissasProvider` + `usePremissas()`, `SliderPanel` com 8 seções
   colapsáveis (Portfólio, Assinaturas, Operacional, Equipe, Custos, Máquina,
   Financeiro, Expansão), `KpiRow` com 7 KPIs (delta vs. As-Is), e os 10 gráficos do
   enunciado em `src/components/dashboard/charts/`.

Tudo verificado rodando o dev server de verdade num browser headless (Playwright),
não só `npm run build`.

### Decisão de calibração importante

Os valores `estimado` de folha/preço/custos fixos foram ajustados à mão para que o
modelo não desse EBITDA negativo em todo cenário por padrão (o primeiro rascunho
tinha a folha completa do organograma de 12 pessoas superando sozinha a receita de
1.580 lavagens/ano). Ver comentários em `premissas.js` (seções `equipe` e `custos`) e
a tabela do README para saber exatamente o que trocar quando a planilha do grupo
chegar.

### Fallback do ano de ativação da máquina

Se o caixa acumulado da trajetória T0 nunca atinge o capex da máquina dentro do
horizonte projetado, o contexto **não força** uma ativação automática no último ano
(isso concentraria o capex inteiro no ano que define o valor terminal via
perpetuidade de Gordon e derrubaria o Enterprise Value artificialmente). Nesse caso
`anoAtivacaoMaquina` fica `null` e T1 = T0 até o usuário mover o slider manualmente.
Ver `PremissasContext.js` (`anoAtivacaoMaquina` vs. `anoAtivacaoSlider`).

### O que falta (fora do escopo já implementado)

- Substituir os valores `estimado` pela planilha financeira real do grupo (tabela de
  correspondência no README).
- Deploy na Vercel (instruções passadas ao usuário fora deste arquivo).
