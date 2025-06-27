import { Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const pendings = [
  { name: "Ana Souza", hours: 8 },
  { name: "Carlos Silva", hours: 6 },
  { name: "Diana Alves", hours: 4 },
];

export default function PendingHoursCard() {
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-axionPurple" size={20} />
          <span className="font-medium text-white text-base">Horas Pendentes de Aprovação</span>
        </div>
        <div className="space-y-3">
          {pendings.map((p, idx) => (
            <div key={idx} className="flex items-center justify-between bg-[#23232b] rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <User className="text-axionBlue" size={16} />
                <span className="text-white font-medium text-sm">{p.name}</span>
              </div>
              <span className="text-axionPurple font-bold text-base">{p.hours}h</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 