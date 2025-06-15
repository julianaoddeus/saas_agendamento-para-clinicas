"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

import AppointmentTableActions from "./table-actions";

type Appointment = typeof appointmentsTable.$inferSelect & {
  patient: typeof patientsTable.$inferSelect;
  doctor: typeof doctorsTable.$inferSelect;
};

export const appointmentsTableColumns: ColumnDef<Appointment>[] = [
  {
    id: "patient",
    accessorKey: "patient.name",
    header: "PACIENTE",
  },
  {
    id: "date",
    accessorKey: "date",
    header: "DATA",
    cell: (params) => {
      const appointment = params.row.original;
      return format(appointment.date, "dd/MM/yy HH:mm", { locale: ptBR });
    },
  },
  {
    id: "doctor",
    accessorKey: "doctor.name",
    header: "MÉDICO",
  },
  {
    id: "actions",
    cell: (params) => {
      const appointment = params.row.original;
      return <AppointmentTableActions appointment={appointment} />;
    },
  },
];
