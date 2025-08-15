"use client";
import { Home, Clock, Folder, BarChart2, DollarSign, Settings, X } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/timesheet", label: "Demandas", icon: Clock },
  { href: "/projects", label: "Projetos", icon: Folder },
  { href: "/reports", label: "Relatórios", icon: BarChart2 },
  { href: "/financial", label: "Financeiro", icon: DollarSign },
  { href: "/admin", label: "Administração", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#10101a] border-r border-[#23232b] shadow-lg">
        <div className="h-16 flex items-center justify-center border-b border-[#23232b]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-white">Axion</span>
          </div>
        </div>
        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-3">
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link 
                  href={href} 
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-[#23232b] hover:text-white transition-all duration-300 group"
                >
                  <Icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#10101a] border-r border-[#23232b] shadow-xl transform transition-transform duration-300 lg:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#23232b]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-white">Axion</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[#23232b] transition-all duration-300"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <nav className="flex-1 py-6">
          <ul className="space-y-1 px-3">
            {navItems.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link 
                  href={href} 
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-[#23232b] hover:text-white transition-all duration-300 group"
                >
                  <Icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
} 