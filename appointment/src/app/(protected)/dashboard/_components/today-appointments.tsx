import { CalendarDays } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

import { appointmentsTableColumns } from "../../appointments/_components/table-columns";

type Appointment = typeof appointmentsTable.$inferSelect & {
  patient: typeof patientsTable.$inferSelect;
  doctor: typeof doctorsTable.$inferSelect;
};

interface TodayAppointmentsProps {
  todayAppointments: Appointment[];
}

export default function TodayAppointments({
  todayAppointments,
}: TodayAppointmentsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <CalendarDays className="text-muted-foreground" />
          <CardTitle className="text-base">Agendamentos</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={appointmentsTableColumns}
          data={todayAppointments}
        />
      </CardContent>
    </Card>
  );
}
