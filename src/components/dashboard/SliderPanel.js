"use client";

import { usePremissas } from "@/hooks/usePremissas";
import { formatBRL, formatPercent } from "@/lib/format";
import Slider from "./Slider";
import SliderSection from "./SliderSection";

const NOME_CARGO = {
  proprietario: "Proprietário",
  gerente: "Gerente",
  subgerente: "Subgerente",
  auxAdministrativo: "Auxiliar administrativo",
  atendente: "Atendente",
  lavador: "Lavador (cada)",
  operadorMaquina: "Operador de máquina",
  contador: "Contador (terceirizado)",
};

const pct = (v) => formatPercent(v);
const brl = (v) => formatBRL(v);

export default function SliderPanel({ onClose }) {
  const { premissas, anoAtivacaoAuto, anoAtivacaoSlider, anoAtivacaoOverride, setAnoAtivacaoMaquina, setValor, setServicoMix, restaurar } =
    usePremissas();

  const s = premissas.servicos;
  const planos = premissas.assinaturas.planos;
  const eq = premissas.equipe;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Fechar premissas"
              className="-ml-1 rounded-md p-1 text-ink-400 hover:text-white lg:hidden"
            >
              ✕
            </button>
          )}
          <p className="text-xs font-medium uppercase tracking-widest text-ink-400">Premissas</p>
        </div>
        <button
          onClick={restaurar}
          className="text-[11px] font-medium text-wine-400 hover:text-wine-300"
        >
          Restaurar
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <SliderSection title="Portfólio" defaultOpen>
          {s.map((servico, i) => (
            <div key={servico.id} className="space-y-2 rounded-lg border border-ink-800 p-3">
              <p className="text-[12px] font-medium text-white">{servico.nome}</p>
              <Slider
                label="Preço"
                value={servico.preco.valor}
                min={servico.preco.min}
                max={servico.preco.max}
                format={brl}
                onChange={(v) => setValor(["servicos", i, "preco"], v)}
              />
              <Slider
                label="Participação no mix"
                value={servico.participacaoMix.valor}
                min={0}
                max={1}
                step={0.01}
                format={pct}
                onChange={(v) => setServicoMix(servico.id, v)}
              />
            </div>
          ))}
        </SliderSection>

        <SliderSection title="Assinaturas">
          {planos.map((plano, i) => (
            <div key={plano.id} className="space-y-2 rounded-lg border border-ink-800 p-3">
              <p className="text-[12px] font-medium text-white">{plano.nome}</p>
              <Slider
                label="Preço"
                value={plano.preco.valor}
                min={plano.preco.min}
                max={plano.preco.max}
                format={brl}
                onChange={(v) => setValor(["assinaturas", "planos", i, "preco"], v)}
              />
              <Slider
                label="Penetração na base"
                value={plano.penetracao.valor}
                min={plano.penetracao.min}
                max={plano.penetracao.max}
                step={0.005}
                format={pct}
                onChange={(v) => setValor(["assinaturas", "planos", i, "penetracao"], v)}
              />
            </div>
          ))}
          <div className="space-y-2 rounded-lg border border-ink-800 p-3">
            <p className="text-[12px] font-medium text-white">Corporativa (B2B)</p>
            <Slider
              label="Preço"
              value={premissas.assinaturas.corporativa.preco.valor}
              min={premissas.assinaturas.corporativa.preco.min}
              max={premissas.assinaturas.corporativa.preco.max}
              format={brl}
              onChange={(v) => setValor(["assinaturas", "corporativa", "preco"], v)}
            />
            <Slider
              label="Penetração na base"
              value={premissas.assinaturas.corporativa.penetracao.valor}
              min={premissas.assinaturas.corporativa.penetracao.min}
              max={premissas.assinaturas.corporativa.penetracao.max}
              step={0.005}
              format={pct}
              onChange={(v) => setValor(["assinaturas", "corporativa", "penetracao"], v)}
            />
          </div>
          <Slider
            label="Base de clientes estimada"
            value={premissas.assinaturas.baseClientesEstimada.valor}
            min={premissas.assinaturas.baseClientesEstimada.min}
            max={premissas.assinaturas.baseClientesEstimada.max}
            step={10}
            unidade="clientes"
            onChange={(v) => setValor(["assinaturas", "baseClientesEstimada"], v)}
          />
        </SliderSection>

        <SliderSection title="Operacional">
          <Slider
            label="Volume anual base"
            value={premissas.operacional.volumeAnualBase.valor}
            min={premissas.operacional.volumeAnualBase.min}
            max={premissas.operacional.volumeAnualBase.max}
            step={10}
            unidade="carros/ano"
            onChange={(v) => setValor(["operacional", "volumeAnualBase"], v)}
          />
          <Slider
            label="Crescimento de demanda"
            value={premissas.operacional.crescimentoDemandaAnual.valor}
            min={premissas.operacional.crescimentoDemandaAnual.min}
            max={premissas.operacional.crescimentoDemandaAnual.max}
            step={0.005}
            format={pct}
            onChange={(v) => setValor(["operacional", "crescimentoDemandaAnual"], v)}
          />
          <Slider
            label="Tempo-alvo de lavagem"
            value={premissas.tempoLavagem.tempoAlvoT0.valor}
            min={premissas.tempoLavagem.tempoAlvoT0.min}
            max={premissas.tempoLavagem.tempoAlvoT0.max}
            unidade="min"
            onChange={(v) => setValor(["tempoLavagem", "tempoAlvoT0"], v)}
          />
          <Slider
            label="Anos até atingir a meta"
            value={premissas.tempoLavagem.anosParaAtingirMeta.valor}
            min={premissas.tempoLavagem.anosParaAtingirMeta.min}
            max={premissas.tempoLavagem.anosParaAtingirMeta.max}
            step={1}
            unidade="anos"
            onChange={(v) => setValor(["tempoLavagem", "anosParaAtingirMeta"], v)}
          />
          <Slider
            label="Boxes manuais (após a máquina)"
            value={premissas.operacional.boxesManuais.t1.valor}
            min={premissas.operacional.boxesManuais.t1.min}
            max={premissas.operacional.boxesManuais.t1.max}
            step={1}
            unidade="boxes"
            onChange={(v) => setValor(["operacional", "boxesManuais", "t1"], v)}
          />
          <Slider
            label="Horas úteis por dia"
            value={premissas.operacional.horasUteisPorDia.valor}
            min={premissas.operacional.horasUteisPorDia.min}
            max={premissas.operacional.horasUteisPorDia.max}
            step={0.5}
            unidade="h"
            onChange={(v) => setValor(["operacional", "horasUteisPorDia"], v)}
          />
          <Slider
            label="Dias úteis por mês"
            value={premissas.operacional.diasUteisPorMes.valor}
            min={premissas.operacional.diasUteisPorMes.min}
            max={premissas.operacional.diasUteisPorMes.max}
            step={1}
            unidade="dias"
            onChange={(v) => setValor(["operacional", "diasUteisPorMes"], v)}
          />
        </SliderSection>

        <SliderSection title="Equipe">
          {Object.entries(eq).map(([cargo, dados]) => (
            <div key={cargo} className="space-y-2 rounded-lg border border-ink-800 p-3">
              <p className="text-[12px] font-medium text-white">{NOME_CARGO[cargo] ?? cargo}</p>
              <Slider
                label="Headcount"
                value={dados.qtd.valor}
                min={dados.qtd.min}
                max={dados.qtd.max}
                step={1}
                unidade="pessoas"
                onChange={(v) => setValor(["equipe", cargo, "qtd"], v)}
              />
              <Slider
                label="Salário"
                value={dados.salario.valor}
                min={dados.salario.min}
                max={dados.salario.max}
                step={50}
                format={brl}
                onChange={(v) => setValor(["equipe", cargo, "salario"], v)}
              />
            </div>
          ))}
        </SliderSection>

        <SliderSection title="Custos">
          <Slider
            label="Aluguel"
            value={premissas.custos.aluguel.valor}
            min={premissas.custos.aluguel.min}
            max={premissas.custos.aluguel.max}
            step={100}
            format={brl}
            onChange={(v) => setValor(["custos", "aluguel"], v)}
          />
          <Slider
            label="Despesas fixas outras"
            value={premissas.custos.despesasFixasOutras.valor}
            min={premissas.custos.despesasFixasOutras.min}
            max={premissas.custos.despesasFixasOutras.max}
            step={100}
            format={brl}
            onChange={(v) => setValor(["custos", "despesasFixasOutras"], v)}
          />
          <Slider
            label="Marketing mensal"
            value={premissas.custos.marketingMensal.valor}
            min={premissas.custos.marketingMensal.min}
            max={premissas.custos.marketingMensal.max}
            step={100}
            format={brl}
            onChange={(v) => setValor(["custos", "marketingMensal"], v)}
          />
        </SliderSection>

        <SliderSection title="Máquina">
          <div>
            <div className="flex items-center justify-between gap-2">
              <label className="text-[12px] text-ink-400">Ano de ativação</label>
              <button
                onClick={() => setAnoAtivacaoMaquina(null)}
                className={`text-[10px] uppercase tracking-wide ${
                  anoAtivacaoOverride == null ? "text-ink-700" : "text-wine-400 hover:text-wine-300"
                }`}
                disabled={anoAtivacaoOverride == null}
              >
                automático
              </button>
            </div>
            <Slider
              label=""
              value={anoAtivacaoSlider}
              min={premissas.maquina.anoAtivacao.min}
              max={premissas.maquina.anoAtivacao.max}
              step={1}
              unidade=""
              onChange={(v) => setAnoAtivacaoMaquina(v)}
            />
            {anoAtivacaoOverride == null && anoAtivacaoAuto == null && (
              <p className="mt-1.5 text-[11px] text-wine-400">
                Caixa não cobre o capex da máquina dentro do horizonte — a operação
                segue sem ela até aqui. Arraste para forçar uma ativação (ex.: financiada).
              </p>
            )}
          </div>
          <Slider
            label="Capex"
            value={premissas.maquina.capex.valor}
            min={premissas.maquina.capex.min}
            max={premissas.maquina.capex.max}
            step={1000}
            format={brl}
            onChange={(v) => setValor(["maquina", "capex"], v)}
          />
          <Slider
            label="Veículos por hora"
            value={premissas.maquina.veiculosHora.valor}
            min={premissas.maquina.veiculosHora.min}
            max={premissas.maquina.veiculosHora.max}
            step={0.5}
            unidade="/h"
            onChange={(v) => setValor(["maquina", "veiculosHora"], v)}
          />
          <Slider
            label="Vida útil (depreciação)"
            value={premissas.maquina.vidaUtilDepreciacao.valor}
            min={premissas.maquina.vidaUtilDepreciacao.min}
            max={premissas.maquina.vidaUtilDepreciacao.max}
            step={1}
            unidade="anos"
            onChange={(v) => setValor(["maquina", "vidaUtilDepreciacao"], v)}
          />
        </SliderSection>

        <SliderSection title="Financeiro">
          <Slider
            label="WACC"
            value={premissas.financeiro.wacc.valor}
            min={premissas.financeiro.wacc.min}
            max={premissas.financeiro.wacc.max}
            step={0.005}
            format={pct}
            onChange={(v) => setValor(["financeiro", "wacc"], v)}
          />
          <Slider
            label="Crescimento na perpetuidade (g)"
            value={premissas.financeiro.crescimentoPerpetuidade.valor}
            min={premissas.financeiro.crescimentoPerpetuidade.min}
            max={premissas.financeiro.crescimentoPerpetuidade.max}
            step={0.0025}
            format={pct}
            onChange={(v) => setValor(["financeiro", "crescimentoPerpetuidade"], v)}
          />
          <Slider
            label="Alíquota efetiva"
            value={premissas.financeiro.aliquotaEfetiva.valor}
            min={premissas.financeiro.aliquotaEfetiva.min}
            max={premissas.financeiro.aliquotaEfetiva.max}
            step={0.005}
            format={pct}
            onChange={(v) => setValor(["financeiro", "aliquotaEfetiva"], v)}
          />
          <Slider
            label="Capex de manutenção"
            value={premissas.financeiro.capexManutencaoAnual.valor}
            min={premissas.financeiro.capexManutencaoAnual.min}
            max={premissas.financeiro.capexManutencaoAnual.max}
            step={500}
            format={brl}
            onChange={(v) => setValor(["financeiro", "capexManutencaoAnual"], v)}
          />
          <Slider
            label="Capital de giro (% da receita)"
            value={premissas.financeiro.capitalGiroSobreReceita.valor}
            min={premissas.financeiro.capitalGiroSobreReceita.min}
            max={premissas.financeiro.capitalGiroSobreReceita.max}
            step={0.005}
            format={pct}
            onChange={(v) => setValor(["financeiro", "capitalGiroSobreReceita"], v)}
          />
          <Slider
            label="Dívida líquida atual"
            value={premissas.financeiro.dividaLiquidaAtual.valor}
            min={premissas.financeiro.dividaLiquidaAtual.min}
            max={premissas.financeiro.dividaLiquidaAtual.max}
            step={1000}
            format={brl}
            onChange={(v) => setValor(["financeiro", "dividaLiquidaAtual"], v)}
          />
        </SliderSection>

        <SliderSection title="Expansão (matriz-filial)">
          <label className="flex items-center gap-2 text-[12px] text-ink-300">
            <input
              type="checkbox"
              checked={premissas.expansao.habilitada.valor}
              onChange={(e) => setValor(["expansao", "habilitada"], e.target.checked)}
              className="h-3.5 w-3.5 accent-wine-500"
            />
            Habilitar expansão
          </label>
          <Slider
            label="Ano de ativação"
            value={premissas.expansao.anoAtivacao.valor}
            min={premissas.expansao.anoAtivacao.min}
            max={premissas.expansao.anoAtivacao.max}
            step={1}
            disabled={!premissas.expansao.habilitada.valor}
            onChange={(v) => setValor(["expansao", "anoAtivacao"], v)}
          />
          <Slider
            label="Número de filiais"
            value={premissas.expansao.numeroFiliais.valor}
            min={premissas.expansao.numeroFiliais.min}
            max={premissas.expansao.numeroFiliais.max}
            step={1}
            disabled={!premissas.expansao.habilitada.valor}
            onChange={(v) => setValor(["expansao", "numeroFiliais"], v)}
          />
          <Slider
            label="Capex por filial"
            value={premissas.expansao.capexPorFilial.valor}
            min={premissas.expansao.capexPorFilial.min}
            max={premissas.expansao.capexPorFilial.max}
            step={1000}
            format={brl}
            disabled={!premissas.expansao.habilitada.valor}
            onChange={(v) => setValor(["expansao", "capexPorFilial"], v)}
          />
          <Slider
            label="Receita mensal por filial"
            value={premissas.expansao.receitaMensalPorFilial.valor}
            min={premissas.expansao.receitaMensalPorFilial.min}
            max={premissas.expansao.receitaMensalPorFilial.max}
            step={500}
            format={brl}
            disabled={!premissas.expansao.habilitada.valor}
            onChange={(v) => setValor(["expansao", "receitaMensalPorFilial"], v)}
          />
          <Slider
            label="Custo mensal por filial"
            value={premissas.expansao.custoMensalPorFilial.valor}
            min={premissas.expansao.custoMensalPorFilial.min}
            max={premissas.expansao.custoMensalPorFilial.max}
            step={500}
            format={brl}
            disabled={!premissas.expansao.habilitada.valor}
            onChange={(v) => setValor(["expansao", "custoMensalPorFilial"], v)}
          />
        </SliderSection>
      </div>
    </div>
  );
}
