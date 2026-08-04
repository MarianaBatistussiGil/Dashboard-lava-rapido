// Paleta de gráficos derivada da marca (vinho + preto + branco). As-Is/T0/T1 formam
// uma progressão real (quanto mais maduro o negócio, mais vívido), então usamos uma
// rampa ordinal de um hue só — passa no validador de acessibilidade sem trapacear a
// marca. Para categorias nominais (serviços, linhas de custo) não há como ter 4-5
// hues realmente distintos dentro de vinho/preto/branco só por cor; compensamos com
// legenda + tooltip + rótulos diretos sempre visíveis (nunca só a cor carrega a
// identidade).

export const CENARIO_COR = {
  asIs: "#5c4650",
  t0: "#af3f57",
  t1: "#e8748c",
};

export const CENARIO_NOME = {
  asIs: "As-Is",
  t0: "T0",
  t1: "T1",
};

export const CENARIO_TRACEJADO = {
  asIs: "5 4",
  t0: "1 0",
  t1: "1 0",
};

export const SERVICO_COR = ["#f3ccd5", "#d16b83", "#af3f57", "#8a2540", "#57132a"];
export const CUSTO_COR = ["#d16b83", "#af3f57", "#8a2540", "#6e1a33"];

export const GRID_COR = "#1a1a1a";
export const EIXO_COR = "#6b6560";
export const SUPERFICIE = "#0a0a0a";

export const tooltipSx = {
  contentStyle: {
    background: "#0a0a0a",
    border: "1px solid #262626",
    borderRadius: 10,
    fontSize: 12,
    color: "#f2f0f1",
  },
  labelStyle: { color: "#9a9a9a", marginBottom: 4, fontSize: 11 },
  itemStyle: { padding: 0 },
};

export const legendSx = {
  wrapperStyle: { fontSize: 11, color: "#9a9a9a", paddingTop: 8 },
};

export const axisSx = {
  tick: { fill: EIXO_COR, fontSize: 11 },
  axisLine: { stroke: GRID_COR },
  tickLine: false,
};

// interpola entre dois tons de vinho para ramp sequencial (mapa de calor)
export function corSequencial(t) {
  const clamped = Math.min(1, Math.max(0, t));
  const claro = [251, 234, 238]; // wine-50
  const escuro = [138, 37, 64]; // wine-500
  const rgb = claro.map((c0, i) => Math.round(c0 + (escuro[i] - c0) * clamped));
  return `rgb(${rgb.join(",")})`;
}
