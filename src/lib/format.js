export function formatBRL(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(valor ?? 0);
}

export function formatPercent(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(valor ?? 0);
}

export function formatNumber(valor) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(valor ?? 0);
}

export function formatMultiplo(valor) {
  return (
    new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor ?? 0) + "x"
  );
}
