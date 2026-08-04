"use client";

import { useContext } from "react";
import { PremissasContext } from "@/contexts/PremissasContext";

export function usePremissas() {
  const ctx = useContext(PremissasContext);
  if (!ctx) throw new Error("usePremissas precisa estar dentro de <PremissasProvider>");
  return ctx;
}
