"use client";

import { createContext, useMemo, useState } from "react";
import { premissasBase } from "@/data/premissas";
import {
  extrairValores,
  normalizarMix,
  projetarSerie,
  enterpriseValue,
  equityValue,
  vplTir,
  vplTirPorDecisao,
  paybackMaquina,
  breakEvenCarrosDia,
  matrizSensibilidade,
  anoAtivacaoAutomatico,
} from "@/lib/dcf";

export const PremissasContext = createContext(null);

function stepsBetween(min, max, n) {
  if (min === max) return [min];
  const passo = (max - min) / (n - 1);
  return Array.from({ length: n }, (_, i) => min + passo * i);
}

export function PremissasProvider({ children }) {
  const [premissas, setPremissas] = useState(() => structuredClone(premissasBase));
  const [anoAtivacaoOverride, setAnoAtivacaoOverride] = useState(null);

  const valores = useMemo(() => extrairValores(premissas), [premissas]);

  const anoInicio = valores.meta.anoInicioProjecao;
  const anoFim = valores.meta.anoFimProjecao;

  // Ano em que o caixa acumulado da trajetória T0 (sem máquina) atinge o capex —
  // usado como default do slider de ativação da máquina.
  const anoAtivacaoAuto = useMemo(() => {
    const serieT0Pura = projetarSerie({ valores, cenario: "t0", anoInicio, anoFim });
    return anoAtivacaoAutomatico({
      serieSemMaquina: serieT0Pura,
      capexMaquina: valores.maquina.capex,
      caixaInicial: valores.financeiro.caixaInicial,
    });
  }, [valores, anoInicio, anoFim]);

  // Se o caixa nunca cruzar o capex dentro do horizonte, não força a ativação: T1
  // permanece igual a T0 (nenhuma máquina comprada nesse horizonte é a leitura
  // honesta). Forçar no último ano jogaria o capex inteiro exatamente no ano que
  // define o valor terminal e explodiria o Enterprise Value para negativo.
  const anoAtivacaoMaquina = anoAtivacaoOverride ?? anoAtivacaoAuto ?? null;
  // Posição do slider: sempre um número (não pode ficar "solto" num input range),
  // estaciona no último ano quando não há ativação automática dentro do horizonte.
  const anoAtivacaoSlider = anoAtivacaoOverride ?? anoAtivacaoAuto ?? anoFim;

  const series = useMemo(
    () => ({
      asIs: projetarSerie({ valores, cenario: "asIs", anoInicio, anoFim }),
      t0: projetarSerie({ valores, cenario: "t0", anoInicio, anoFim }),
      t1: projetarSerie({ valores, cenario: "t1", anoInicio, anoFim, anoAtivacaoMaquina }),
    }),
    [valores, anoInicio, anoFim, anoAtivacaoMaquina]
  );

  const valuation = useMemo(() => {
    const wacc = valores.financeiro.wacc;
    const g = valores.financeiro.crescimentoPerpetuidade;
    const dividaLiquida = valores.financeiro.dividaLiquidaAtual;
    const ev = enterpriseValue({ serie: series.t1, wacc, g });
    const eq = equityValue({ enterpriseValue: ev.enterpriseValue, dividaLiquida });
    const evAsIs = enterpriseValue({ serie: series.asIs, wacc, g });
    const eqAsIs = equityValue({ enterpriseValue: evAsIs.enterpriseValue, dividaLiquida });
    return { ev, eq, evAsIs, eqAsIs };
  }, [series, valores.financeiro]);

  const decisao = useMemo(() => {
    const porFase = vplTirPorDecisao({ valores, anoAtivacaoMaquina });
    // VPL/TIR do plano inteiro (As-Is -> T1), para o KPI de topo
    const fluxosCaixa = series.t1.map((anoDado, i) => anoDado.fcff - series.asIs[i].fcff);
    const total = vplTir({ investimentoInicial: 0, fluxosCaixa, wacc: valores.financeiro.wacc });
    return { ...porFase, total };
  }, [valores, anoAtivacaoMaquina, series]);

  const payback = useMemo(
    () =>
      anoAtivacaoMaquina != null
        ? paybackMaquina({ serieT0: series.t0, serieT1: series.t1, anoAtivacaoMaquina })
        : null,
    [series, anoAtivacaoMaquina]
  );

  const breakEven = useMemo(() => {
    const ultimo = series.t1[series.t1.length - 1];
    if (!ultimo || ultimo.volumeAtendido === 0) return null;
    return breakEvenCarrosDia({
      custosFixosAnuais: ultimo.custos.fixos,
      precoMedio: ultimo.receita.total / ultimo.volumeAtendido,
      custoVariavelMedio: ultimo.custos.variaveis / ultimo.volumeAtendido,
      diasUteisAno: valores.operacional.diasUteisPorMes * 12,
    });
  }, [series, valores.operacional.diasUteisPorMes]);

  const sensibilidade = useMemo(() => {
    const waccMeta = premissas.financeiro.wacc;
    const gMeta = premissas.financeiro.crescimentoPerpetuidade;
    const waccRange = stepsBetween(waccMeta.min, waccMeta.max, 5);
    const gRange = stepsBetween(gMeta.min, gMeta.max, 5);
    return matrizSensibilidade({ valores, waccRange, gRange, anoAtivacaoMaquina });
  }, [valores, anoAtivacaoMaquina, premissas.financeiro.wacc, premissas.financeiro.crescimentoPerpetuidade]);

  function setValor(path, novoValor) {
    setPremissas((prev) => {
      const next = structuredClone(prev);
      let node = next;
      for (let i = 0; i < path.length - 1; i++) node = node[path[i]];
      node[path[path.length - 1]].valor = novoValor;
      return next;
    });
  }

  function setServicoMix(id, novoValor) {
    setPremissas((prev) => {
      const next = structuredClone(prev);
      const plano = next.servicos.map((s) => ({ id: s.id, participacaoMix: s.participacaoMix.valor }));
      const normalizado = normalizarMix(plano, id, novoValor);
      next.servicos.forEach((s, i) => {
        s.participacaoMix.valor = normalizado[i].participacaoMix;
      });
      return next;
    });
  }

  function restaurar() {
    setPremissas(structuredClone(premissasBase));
    setAnoAtivacaoOverride(null);
  }

  const value = {
    premissas,
    valores,
    series,
    valuation,
    decisao,
    payback,
    breakEven,
    sensibilidade,
    anoAtivacaoMaquina,
    anoAtivacaoSlider,
    anoAtivacaoAuto,
    anoAtivacaoOverride,
    setAnoAtivacaoMaquina: setAnoAtivacaoOverride,
    setValor,
    setServicoMix,
    restaurar,
  };

  return <PremissasContext.Provider value={value}>{children}</PremissasContext.Provider>;
}
