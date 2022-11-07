const audienceList = [
  { value: "everyone", label: "Tout le monde", shortLabel: "Tout le monde" },
  {
    value: "analyste-programmeur",
    label: "Analyste Programmeur - Développeur informatique",
    shortLabel: "Dév. informatique",
  },
];

export default audienceList;

export const yearsList = [
  { value: "-2010", label: "Avant 2010" },
  ...Array(new Date().getFullYear() - 2010 + 1)
    .fill(0)
    .map((_, i) => ({
      value: (2010 + i).toString(),
      label: (2010 + i).toString(),
    })),
];
