// Paleta de gráficos derivada da marca (azul + preto + branco, extraída da logo real
// em src/app/assets/image.png). As-Is/T0/T1 formam uma progressão real (quanto mais
// maduro o negócio, mais vívido), então usamos uma rampa ordinal de um hue só — passa
// no validador de acessibilidade sem trapacear a marca. Para categorias nominais
// (serviços, linhas de custo) não há como ter 4-5 hues realmente distintos dentro de
// azul/preto/branco só por cor; compensamos com legenda + tooltip + rótulos diretos
// sempre visíveis (nunca só a cor carrega a identidade).

export const CENARIO_COR = {
  asIs: "#57687f",
  t0: "#0d489a",
  t1: "#4aa2ee",
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

export const SERVICO_COR = ["#d7ecfd", "#7cbdf5", "#4aa2ee", "#1663c2", "#0a3576"];
export const CUSTO_COR = ["#7cbdf5", "#4aa2ee", "#2b82dd", "#1663c2"];

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

// interpola entre dois tons de azul para ramp sequencial (mapa de calor)
export function corSequencial(t) {
  const clamped = Math.min(1, Math.max(0, t));
  const claro = [238, 246, 254]; // blue-50
  const escuro = [13, 72, 154]; // blue-700
  const rgb = claro.map((c0, i) => Math.round(c0 + (escuro[i] - c0) * clamped));
  return `rgb(${rgb.join(",")})`;
}
