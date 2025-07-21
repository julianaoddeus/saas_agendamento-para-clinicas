export enum WeekDays {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export const weekDaysLabels: Record<WeekDays, string> = {
  [WeekDays.SUNDAY]: "Domingo",
  [WeekDays.MONDAY]: "Segunda-feira",
  [WeekDays.TUESDAY]: "Terça-feira",
  [WeekDays.WEDNESDAY]: "Quarta-feira",
  [WeekDays.THURSDAY]: "Quinta-feira",
  [WeekDays.FRIDAY]: "Sexta-feira",
  [WeekDays.SATURDAY]: "Sábado",
};
