import { CalendarCheck, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const nextPayment = {
  value: 2400,
  date: "10/07/2024",
  status: "Aguardando aprovação",
};

export default function NextPaymentCard() {
  return (
    <Card className="bg-[#18181b] border border-[#23232b] shadow-lg">
      <CardContent className="p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="text-axionBlue" size={24} />
          <span className="font-bold text-white text-lg">Próximo Pagamento</span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-3xl font-bold text-axionBlue">R$ {nextPayment.value.toLocaleString()}</span>
          <span className="text-muted-foreground flex items-center gap-1">
            <CalendarCheck className="text-axionPurple" size={18} />
            {nextPayment.date}
          </span>
        </div>
        <div className="mt-2 text-xs">
          <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded-full">{nextPayment.status}</span>
        </div>
        <Button variant="outline" className="border-axionBlue text-axionBlue hover:bg-axionBlue/10 mt-4 w-max" size="sm">
          Ver detalhes
        </Button>
      </CardContent>
    </Card>
  );
} 