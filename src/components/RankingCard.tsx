import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ranking = {
  position: 2,
  total: 8,
  message: "Você está em 2º lugar em horas trabalhadas este mês! Continue assim para alcançar o topo!"
};

export default function RankingCard() {
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg flex flex-col items-center justify-center text-center p-6">
      <CardContent>
        <Trophy className="text-axionBlue mx-auto mb-2" size={32} />
        <div className="text-3xl font-bold text-white mb-1">#{ranking.position}</div>
        <div className="text-xs text-muted-foreground mb-2">de {ranking.total} consultores</div>
        <div className="text-sm text-axionPurple font-medium">{ranking.message}</div>
      </CardContent>
    </Card>
  );
} 