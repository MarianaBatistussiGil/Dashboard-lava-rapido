"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { estaAutenticado, sair } from "@/lib/auth";
import { PremissasProvider } from "@/contexts/PremissasContext";
import SliderPanel from "@/components/dashboard/SliderPanel";
import KpiRow from "@/components/dashboard/KpiRow";
import ScenarioLegend from "@/components/dashboard/ScenarioLegend";
import RevenueEbitdaChart from "@/components/dashboard/charts/RevenueEbitdaChart";
import RevenueByServiceChart from "@/components/dashboard/charts/RevenueByServiceChart";
import SubscriptionVsOneOffChart from "@/components/dashboard/charts/SubscriptionVsOneOffChart";
import CapacityUtilizationChart from "@/components/dashboard/charts/CapacityUtilizationChart";
import WashTimeChart from "@/components/dashboard/charts/WashTimeChart";
import CostCompositionChart from "@/components/dashboard/charts/CostCompositionChart";
import FcffChart from "@/components/dashboard/charts/FcffChart";
import EquityBridgeChart from "@/components/dashboard/charts/EquityBridgeChart";
import SensitivityTable from "@/components/dashboard/charts/SensitivityTable";
import CashAccumulationChart from "@/components/dashboard/charts/CashAccumulationChart";

export default function DashboardPage() {
  const router = useRouter();
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (!estaAutenticado()) {
      router.replace("/");
      return;
    }
    setPronto(true);
  }, [router]);

  function handleSair() {
    sair();
    router.replace("/");
  }

  if (!pronto) return null;

  return (
    <PremissasProvider>
      <main className="min-h-screen bg-ink-950">
        <header className="flex items-center justify-between border-b border-ink-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-wine-500" />
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-400">
              Nogueira · Valuation Suite
            </p>
          </div>
          <div className="flex items-center gap-5">
            <ScenarioLegend />
            <button
              onClick={handleSair}
              className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs font-medium text-ink-300 transition hover:border-ink-500 hover:text-white"
            >
              Sair
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row">
          <aside className="border-ink-800 lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-r">
            <SliderPanel />
          </aside>

          <div className="min-w-0 flex-1 space-y-5 p-6">
            <KpiRow />

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className="xl:col-span-2">
                <RevenueEbitdaChart />
              </div>
              <RevenueByServiceChart />
              <SubscriptionVsOneOffChart />
              <div className="xl:col-span-2">
                <CapacityUtilizationChart />
              </div>
              <WashTimeChart />
              <CostCompositionChart />
              <FcffChart />
              <EquityBridgeChart />
              <div className="xl:col-span-2">
                <SensitivityTable />
              </div>
              <div className="xl:col-span-2">
                <CashAccumulationChart />
              </div>
            </div>
          </div>
        </div>
      </main>
    </PremissasProvider>
  );
}
