import { DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { mes: "Jan", receita: 8000 },
  { mes: "Fev", receita: 12000 },
  { mes: "Mar", receita: 15000 },
  { mes: "Abr", receita: 20000 },
  { mes: "Mai", receita: 25000 },
  { mes: "Jun", receita: 45900 },
];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#23232b] rounded-lg px-3 py-2 text-xs text-white shadow">
        <span>R$ {payload[0].value}</span>
      </div>
    );
  }
  return null;
};

export default function AdminRevenueChart() {
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="text-axionBlue" size={20} />
          <span className="font-medium text-white text-base">Receita Mensal (Global)</span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 24, right: 32, left: 24, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#23232b" />
            <XAxis dataKey="mes" stroke="#A855F7" axisLine={false} tickLine={false} tick={{ fill: '#A855F7', fontSize: 18, fontFamily: 'Inter', fontWeight: 600, letterSpacing: 0.5 }} />
            <YAxis stroke="#3B82F6" axisLine={false} tickLine={false} tick={{ fill: '#3B82F6', fontSize: 18, fontFamily: 'Inter', fontWeight: 600, letterSpacing: 0.5 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1, opacity: 0.08 }} />
            <Line type="monotone" dataKey="receita" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: '#A855F7', stroke: '#3B82F6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 