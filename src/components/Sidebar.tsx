"use client";
import { Home, Clock, Folder, BarChart2, DollarSign, LogOut, Settings } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/timesheet", label: "Demandas", icon: Clock },
  { href: "/projects", label: "Projetos", icon: Folder },
  { href: "/reports", label: "Relatórios", icon: BarChart2 },
  { href: "/financial", label: "Financeiro", icon: DollarSign },
  { href: "/admin", label: "Administração", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#10101a] border-r border-[#23232b] shadow-lg">
      <div className="h-20 flex items-center justify-center border-b border-[#23232b]">
        <span className="text-2xl font-bold axion-gradient bg-clip-text text-transparent">Axion</span>
      </div>
      <nav className="flex-1 py-6">
        <ul className="space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link href={href} className="flex items-center gap-3 px-6 py-3 rounded-lg text-foreground/90 hover:bg-axion-gradient hover:text-white transition-all">
                <Icon size={20} />
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-6 border-t border-[#23232b]">
        <button className="flex items-center gap-2 text-foreground/60 hover:text-axionBlue transition-all">
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
} 