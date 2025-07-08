import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { nome: "Ana", horas: 120 },
  { nome: "Bruno", horas: 110 },
  { nome: "Carlos", horas: 98 },
  { nome: "Diana", horas: 85 },
  { nome: "Eduardo", horas: 80 },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { nome: string } }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#23232b] rounded-lg px-3 py-2 text-xs text-white shadow">
        <span>{payload[0].payload.nome}: {payload[0].value}h</span>
      </div>
    );
  }
  return null;
};

export default function ConsultantHoursBarChart() {
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-axionPurple" size={20} />
          <span className="font-medium text-white text-base">Horas por Consultor</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} layout="vertical" margin={{ top: 24, right: 32, left: 24, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#23232b" />
            <XAxis type="number" stroke="#3B82F6" axisLine={false} tickLine={false} tick={{ fill: '#3B82F6', fontSize: 18, fontFamily: 'Inter', fontWeight: 600, letterSpacing: 0.5 }} />
            <YAxis dataKey="nome" type="category" stroke="#A855F7" axisLine={false} tickLine={false} tick={{ fill: '#A855F7', fontSize: 18, fontFamily: 'Inter', fontWeight: 600, letterSpacing: 0.5 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#3B82F6', opacity: 0.08 }} />
            <Bar dataKey="horas" fill="#3B82F6" radius={8} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 