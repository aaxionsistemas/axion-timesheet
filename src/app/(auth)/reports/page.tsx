"use client";
import React from "react";

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <h2 className="text-2xl font-bold mb-6 axion-gradient bg-clip-text text-transparent">Relatórios</h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <input type="date" className="px-3 py-2 rounded bg-background border border-[#23232b] text-foreground focus:outline-none focus:ring-2 focus:ring-axionBlue" />
        <input type="date" className="px-3 py-2 rounded bg-background border border-[#23232b] text-foreground focus:outline-none focus:ring-2 focus:ring-axionBlue" />
        <select className="px-3 py-2 rounded bg-background border border-[#23232b] text-foreground focus:outline-none focus:ring-2 focus:ring-axionBlue">
          <option>Todos os projetos</option>
        </select>
      </div>
      <div className="bg-[#18181b] rounded-xl p-6 shadow-lg min-h-[200px] flex items-center justify-center text-foreground/60">
        [Gráficos e relatórios em breve]
      </div>
    </main>
  );
} 