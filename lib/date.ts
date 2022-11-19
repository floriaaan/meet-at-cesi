import { getPlural } from "@/lib/string";

const getDiff = (date: Date, from: Date) => {
  const diffNumber = from.getTime() - date.getTime();

  const diff = {
    year: Math.floor(diffNumber / (1000 * 60 * 60 * 24 * 365)),
    month: Math.floor(diffNumber / (1000 * 60 * 60 * 24 * 30)),
    day: Math.floor(diffNumber / (1000 * 60 * 60 * 24)),
    hour: Math.floor(diffNumber / (1000 * 60 * 60)),
    minute: Math.floor(diffNumber / (1000 * 60)),
  };

  return diff;
};

export const formatRelative = (date: string | Date) => {
  const { year, month, day, hour, minute } = getDiff(
    new Date(date),
    new Date()
  );

  if (year > 0) return `${year} ${getPlural(year, "an", "ans")}`;
  if (month > 0) return `${month} mois`;
  if (day > 0) return `${day} ${getPlural(day, "jour", "jours")}`;
  if (hour > 0) return `${hour} ${getPlural(hour, "heure", "heures")}`;
  if (minute > 0) return `${minute} ${getPlural(minute, "minute", "minutes")}`;
  return "quelques secondes";
};
