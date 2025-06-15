"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { formatCurrencyInCents } from "@/_helpers/currency";
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
    id: "speciality",
    accessorKey: "doctor.speciality",
    header: "ESPECIALIDADE",
  },
  {
    id: "price",
    accessorKey: "appointmentPriceInCents",
    header: "VALOR",
    cell: (params) => {
      const appointment = params.row.original;
      return formatCurrencyInCents(appointment.appointmentPriceInCents);
    },
  },
  {
    id: "actions",
    cell: (params) => {
      const appointment = params.row.original;
      return <AppointmentTableActions appointment={appointment} />;
    },
  },
];
