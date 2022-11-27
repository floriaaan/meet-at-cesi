export const getPlural = (count: number, singular: string, plural: string) =>
  `${count > 1 ? plural : singular}`;

export const getInitials = (name: string) => {
  const initials = name
    .split(" ")
    .map((name) => name[0])
    .join("");
  return initials;
};
