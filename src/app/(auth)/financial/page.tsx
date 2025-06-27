"use client";
import React from "react";

export default function FinancialPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <h2 className="text-2xl font-bold mb-6 axion-gradient bg-clip-text text-transparent">Financeiro</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl p-6 bg-axion-card text-white shadow-lg">
          <span className="block text-sm opacity-80">Receita total</span>
          <span className="text-2xl font-bold mt-2">R$ 12.500</span>
        </div>
        <div className="rounded-xl p-6 bg-axion-card text-white shadow-lg">
          <span className="block text-sm opacity-80">Despesas</span>
          <span className="text-2xl font-bold mt-2">R$ 3.200</span>
        </div>
        <div className="rounded-xl p-6 bg-axion-card text-white shadow-lg">
          <span className="block text-sm opacity-80">Saldo</span>
          <span className="text-2xl font-bold mt-2">R$ 9.300</span>
        </div>
      </div>
      <div className="bg-[#18181b] rounded-xl p-6 shadow-lg min-h-[200px] flex items-center justify-center text-foreground/60">
        [Tabela de movimentações em breve]
      </div>
    </main>
  );
} 