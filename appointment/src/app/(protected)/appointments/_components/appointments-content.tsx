"use client";

import { useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageHeader,
  PageHeaderContent,
  PageHeaderDescription,
  PageHeaderTitle,
} from "@/components/ui/page-container";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

import AddAppointmentButton from "./add-appointment-button";
import AppointmentsFilters from "./appointments-filters";
import { appointmentsTableColumns } from "./table-columns";

type Appointment = typeof appointmentsTable.$inferSelect & {
  patient: typeof patientsTable.$inferSelect;
  doctor: typeof doctorsTable.$inferSelect;
};

interface AppointmentsContentProps {
  appointments: Appointment[];
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
}

export default function AppointmentsContent({
  appointments: initialAppointments,
  patients,
  doctors,
}: AppointmentsContentProps) {
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState<
    "date" | "doctor" | "patient" | "specialty"
  >("date");

  const filteredAppointments = initialAppointments.filter((appointment) => {
    if (!filterValue) return true;

    const searchValue = filterValue.toLowerCase();
    return (
      appointment.patient.name.toLowerCase().includes(searchValue) ||
      appointment.doctor.name.toLowerCase().includes(searchValue) ||
      appointment.doctor.specialty.toLowerCase().includes(searchValue)
    );
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return a.date.getTime() - b.date.getTime();
      case "doctor":
        return a.doctor.name.localeCompare(b.doctor.name);
      case "patient":
        return a.patient.name.localeCompare(b.patient.name);
      case "specialty":
        return a.doctor.specialty.localeCompare(b.doctor.specialty);
      default:
        return 0;
    }
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageHeaderTitle>Agendamentos</PageHeaderTitle>
          <PageHeaderDescription>
            Gerencie os agendamentos da clínica
          </PageHeaderDescription>
        </PageHeaderContent>
        <PageActions>
          <AppointmentsFilters
            onFilterChange={setFilterValue}
            onSortChange={setSortBy}
          />
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable
          columns={appointmentsTableColumns}
          data={sortedAppointments}
        />
      </PageContent>
    </PageContainer>
  );
}
