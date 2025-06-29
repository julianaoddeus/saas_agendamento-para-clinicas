import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface SubscriptionPlanProps {
  active?: boolean;
}

export default function SubscriptionPlan({
  active = false,
}: SubscriptionPlanProps) {
  const features = [
    "Cadastro de até 3 médicos",
    "Agendamentos ilimitados",
    "Métricas básicas",
    "Cadastro de pacientes",
    "Confirmação manual",
    "Suporte via e-mail",
    "Exportação em CSV",
  ];

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Essential</h3>
          {active && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
              Atual
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          Para profissionais autônomos ou pequenas clínicas
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">R$59</span>
          <span className="text-muted-foreground text-sm">/ mês</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-4 border-t border-gray-200 pt-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <p className="ml-3 text-gray-600">{feature}</p>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" variant={active ? "outline" : "default"}>
          {active ? "Gerenciar Assinatura" : "Fazer Assinatura"}
        </Button>
      </CardFooter>
    </Card>
  );
}
