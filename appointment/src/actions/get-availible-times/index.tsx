"use server";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { eq } from "drizzle-orm";
import z from "zod";

import { db } from "@/db";
import { appointmentsTable, doctorsTable } from "@/db/schema";
import { generateTimeSlots } from "@/helpers/generateTimeSlots";
import { actionClient } from "@/lib/next-safe-action";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getAvailableTimes = actionClient
  .schema(
    z.object({
      date: z.date(),
      doctorId: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const doctor = await db.query.doctorsTable.findFirst({
      where: eq(doctorsTable.id, parsedInput.doctorId),
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const selectedDayOfweek = dayjs(parsedInput.date).day();

    const doctorsIsAvailable =
      selectedDayOfweek >= doctor.availableFromWeekDays &&
      selectedDayOfweek <= doctor.availableToWeekDays;

    if (!doctorsIsAvailable) return [];

    const appointments = await db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.doctorId, parsedInput.doctorId),
    });

    const appointmentsOnSelectedDate = appointments
      .filter((appointment) => {
        return dayjs(appointment.date).isSame(parsedInput.date, "day");
      })
      .map((appointment) => dayjs(appointment.date).format("HH:mm:ss"));

    // Converte esses horários para o horário local usando dayjs.utc().local()
    const fromTime = dayjs
      .utc(`2024-01-01 ${doctor.availableFromTime}`)
      .local()
      .format("HH:mm:ss");

    const toTime = dayjs
      .utc(`2024-01-01 ${doctor.availableToTime}`)
      .local()
      .format("HH:mm:ss");

    const timeSlots = generateTimeSlots(fromTime, toTime);

    // Usa os horários convertidos para gerar os slots de tempo e fazer as comparações
    const doctorTimeSlots = timeSlots.filter((time) => {
      return time.value >= fromTime && time.value <= toTime;
    });

    return doctorTimeSlots.map((time) => ({
      value: time.value,
      isAvailable: !appointmentsOnSelectedDate.includes(time.value),
      label: time.value.substring(0, 5),
    }));
  });
