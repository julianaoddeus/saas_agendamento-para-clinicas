export const doctorInitials = (name: string | undefined) => {
  return name
    ? name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";
};
