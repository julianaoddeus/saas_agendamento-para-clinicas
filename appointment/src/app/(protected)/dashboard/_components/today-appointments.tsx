import { Hospital } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";

import { medicalSpecialtiesWithIcons } from "./_constant";

interface TopSpecialtiesProps {
  todayAppointments: {
    specialty: string;
    appointments: number;
  }[];
}

export default function TopSpecialties({
  todayAppointments,
}: TopSpecialtiesProps) {
  return (
    <Card className="mx-auto w-full">
      <CardContent>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hospital className="text-muted-foreground" />
            <CardTitle className="text-base">Especialidades</CardTitle>
          </div>
        </div>

        {/* specialty List */}
        <div className="space-y-6">
          {todayAppointments.map((specialty) => {
            const Icon = medicalSpecialtiesWithIcons.find(
              (item) => item.value === specialty.specialty,
            )?.icon;
            return (
              <div
                key={specialty.specialty}
                className="flex items-center gap-2"
              >
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  {Icon ? (
                    <Icon className="h-5 w-5 text-blue-600" />
                  ) : (
                    <span className="h-5 w-5" />
                  )}
                </div>
                <div className="flex w-full flex-col justify-center">
                  <div className="flex w-full justify-between">
                    <h3 className="text-sm">{specialty.specialty}</h3>
                    <div className="text-right">
                      <span className="text-muted-foreground text-sm font-medium">
                        {specialty.appointments} agend.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
