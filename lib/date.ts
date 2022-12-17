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
  if (!date) return "";

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

// Input datetime-local is 1 hour behind the actual date in FRENCH timezone
export const toLocalDate = (date: string | Date) => {
  const [dateString, timeString] = date.toString().split("T");
  const [hours, minutes] = timeString.split(":");
  const dateObject = new Date(dateString);
  dateObject.setHours(+hours + 1);
  dateObject.setMinutes(+minutes);
  return dateObject;
};

export const fromLocalDate = (date: Date) => {
  const [dateString, timeString] = date.toISOString().split("T");
  const [hours, minutes] = timeString.split(":");
  const dateObject = new Date(dateString);

  // watch out how we don't change hour but it set to locale (fr) hour
  dateObject.setHours(+hours);
  dateObject.setMinutes(+minutes);
  return dateObject;
};

export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
) => {
  if (!date) return "";

  const dateObject = new Date(date);
  return dateObject.toLocaleDateString("fr-FR", options);
};
