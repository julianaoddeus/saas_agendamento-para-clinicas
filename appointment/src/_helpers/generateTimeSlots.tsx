// Helper para gerar horários
export const generateTimeSlots = (
    start: string,
    end: string,
    interval: number = 30,
  ) => {
    const times: { value: string; label: string }[] = [];
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);
  
    let currentHour = startHour;
    let currentMinute = startMinute;
  
    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMinute <= endMinute)
    ) {
      const timeValue = `${currentHour.toString().padStart(2, "0")}:${currentMinute
        .toString()
        .padStart(2, "0")}:00`;
      const timeLabel = `${currentHour.toString().padStart(2, "0")}:${currentMinute
        .toString()
        .padStart(2, "0")}`;
  
      times.push({ value: timeValue, label: timeLabel });
  
      currentMinute += interval;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }
  
    return times;
  };