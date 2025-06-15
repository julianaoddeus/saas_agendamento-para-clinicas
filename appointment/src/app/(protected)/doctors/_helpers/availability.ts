import "dayjs/locale/pt-br";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("pt-br");

import { doctorsTable } from "@/db/schema";

export const getAvailability = (doctor: typeof doctorsTable.$inferSelect) => {
  const from = dayjs()
    .utc()
    .day(doctor.availableFromWeekDays)
    .set("hour", Number(doctor.availableFromTime.split(":")[0]))
    .set("minute", Number(doctor.availableFromTime.split(":")[1]))
    .set("second", Number(doctor.availableFromTime.split(":")[2] || 0))
    .local();

  const to = dayjs()
    .utc()
    .day(doctor.availableToWeekDays)
    .set("hour", Number(doctor.availableToTime.split(":")[0]))
    .set("minute", Number(doctor.availableToTime.split(":")[1]))
    .set("second", Number(doctor.availableToTime.split(":")[2] || 0))
    .local();

  return { from, to };
};
