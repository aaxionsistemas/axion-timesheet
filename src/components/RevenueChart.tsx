"use client";
import React, { useState } from "react";
import { MonthlyRevenue } from "@/types/financial";

interface RevenueChartProps {
  data: MonthlyRevenue[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatShort = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}k`;
    }
    return amount.toString();
  };

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const minRevenue = Math.min(...data.map(d => d.revenue));
  const maxProfit = Math.max(...data.map(d => d.profit));
  const chartHeight = 100;
  const chartWidth = 100;

  // Calcular pontos da linha
  const revenuePoints = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - ((item.revenue - minRevenue) / (maxRevenue - minRevenue)) * chartHeight;
    return { x, y, revenue: item.revenue, profit: item.profit, month: item.month };
  });

  const profitPoints = data.map((item, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = chartHeight - (item.profit / maxProfit) * chartHeight;
    return { x, y, profit: item.profit };
  });

  // Criar path SVG para linha de receita
  const revenuePath = revenuePoints.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${path} L ${point.x} ${point.y}`;
  }, "");

  // Criar path SVG para linha de lucro
  const profitPath = profitPoints.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${path} L ${point.x} ${point.y}`;
  }, "");

  return (
    <div className="bg-[#18181b] rounded-lg p-3 border border-[#27272a]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-foreground/80">
          Receita Mensal
        </h3>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-foreground/60">Receita</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-foreground/60">Lucro</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-24"
          style={{ overflow: 'visible' }}
        >
          {/* Área de fundo para receita */}
          <defs>
            <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0"/>
            </linearGradient>
          </defs>
          
          {/* Área preenchida receita */}
          <path
            d={`${revenuePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
            fill="url(#revenueGradient)"
          />
          
          {/* Linha de receita */}
          <path
            d={revenuePath}
            stroke="rgb(59, 130, 246)"
            strokeWidth="2.5"
            fill="none"
            className="drop-shadow-sm"
          />
          
          {/* Linha de lucro */}
          <path
            d={profitPath}
            stroke="rgb(34, 197, 94)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4,3"
          />

          {/* Pontos interativos */}
          {revenuePoints.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint === index ? "4" : "3"}
                fill="rgb(59, 130, 246)"
                stroke="white"
                strokeWidth="1.5"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              
              {/* Tooltip */}
              {hoveredPoint === index && (
                <g>
                  <foreignObject 
                    x={point.x - 35} 
                    y={point.y - 45} 
                    width="70" 
                    height="40"
                  >
                    <div className="bg-[#27272a] border border-[#3a3a3d] rounded px-2 py-1 text-xs text-center shadow-lg">
                      <div className="text-foreground/90 font-medium">{point.month.slice(0, 3)}</div>
                      <div className="text-blue-400">{formatShort(point.revenue)}</div>
                      <div className="text-green-400">+{formatShort(point.profit)}</div>
                    </div>
                  </foreignObject>
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* Labels dos meses */}
        <div className="flex justify-between text-xs text-foreground/50 mt-1">
          {data.map((month, index) => (
            <span key={index} className="text-center">
              {month.month.slice(0, 3)}
            </span>
          ))}
        </div>
      </div>

      {/* Resumo compacto */}
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#27272a]/50">
        <div className="text-center">
          <div className="text-sm font-semibold text-blue-400">
            {formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0))}
          </div>
          <div className="text-xs text-foreground/50">Total</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-green-400">
            {formatCurrency(data.reduce((sum, d) => sum + d.profit, 0))}
          </div>
          <div className="text-xs text-foreground/50">Lucro</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-foreground">
            {((data.reduce((sum, d) => sum + d.profit, 0) / data.reduce((sum, d) => sum + d.revenue, 0)) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-foreground/50">Margem</div>
        </div>
      </div>
    </div>
  );
} 