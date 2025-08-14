import { BarChart2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { ChartService, WeeklyHoursData } from "@/lib/chartService";

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: { projeto: string } }> }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#23232b] rounded-lg px-3 py-2 text-xs text-white shadow">
        <span>{payload[0].value}h</span>
      </div>
    );
  }
  return null;
};

interface WorkedHoursChartProps {
  consultantName?: string;
}

export default function WorkedHoursChart({ consultantName }: WorkedHoursChartProps) {
  const [data, setData] = useState<WeeklyHoursData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklyHours();
  }, [consultantName]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadWeeklyHours = async () => {
    try {
      setLoading(true);
      const weeklyData = await ChartService.getWeeklyHours(consultantName);
      setData(weeklyData);
    } catch (error) {
      console.error('Erro ao carregar horas semanais:', error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="text-axionPurple" size={20} />
            <span className="font-medium text-white text-base">Horas Trabalhadas no Mês</span>
          </div>
          <div className="h-[160px] flex items-center justify-center text-gray-500">
            Carregando...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="text-axionPurple" size={20} />
          <span className="font-medium text-white text-base">Horas Trabalhadas no Mês</span>
        </div>
        {data.length === 0 || data.every(d => d.horas === 0) ? (
          <div className="h-[160px] flex items-center justify-center text-gray-500">
            Nenhuma hora registrada
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={data} margin={{ top: 24, right: 32, left: 24, bottom: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#23232b" />
              <XAxis dataKey="semana" stroke="#A855F7" axisLine={false} tickLine={false} tick={{ fill: '#A855F7', fontSize: 12, fontFamily: 'Inter', fontWeight: 600, letterSpacing: 0.5 }} />
              <YAxis stroke="#3B82F6" axisLine={false} tickLine={false} tick={{ fill: '#3B82F6', fontSize: 12, fontFamily: 'Inter', fontWeight: 600, letterSpacing: 0.5 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1, opacity: 0.08 }} />
              <Line type="monotone" dataKey="horas" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5, fill: '#A855F7', stroke: '#3B82F6', strokeWidth: 2 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
} 