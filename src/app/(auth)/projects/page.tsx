"use client";
import React from "react";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background p-6">
      <h2 className="text-2xl font-bold mb-6 axion-gradient bg-clip-text text-transparent">Projetos</h2>
      <div className="flex justify-end mb-4">
        <button className="px-4 py-2 rounded bg-axion-gradient text-white font-semibold transition-all hover:scale-105">Novo projeto</button>
      </div>
      <div className="bg-[#18181b] rounded-xl p-6 shadow-lg min-h-[200px] flex items-center justify-center text-foreground/60">
        [Lista de projetos em breve]
      </div>
    </main>
  );
} 