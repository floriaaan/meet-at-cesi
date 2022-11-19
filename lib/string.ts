export const getPlural = (count: number, singular: string, plural: string) =>
  `${count > 1 ? plural : singular}`;
