"use client";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-20 px-4 md:px-8 bg-[#10101a] border-b border-[#23232b]">
      <button className="md:hidden p-2 rounded hover:bg-axion-gradient transition-all">
        <Menu size={24} className="text-foreground" />
      </button>
      <div className="flex-1 flex justify-end items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground/80">Olá, João!</span>
          <div className="w-9 h-9 rounded-full bg-axion-gradient flex items-center justify-center font-bold text-white shadow-lg">
            JP
          </div>
        </div>
      </div>
    </header>
  );
} 