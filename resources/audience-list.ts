import promotions from "@/resources/promotions.json";

export const audienceList = promotions;

export const yearsList = [
	{ value: "-2010", label: "Avant 2010" },
	...Array(new Date().getFullYear() - 2010 + 1)
		.fill(0)
		.map((_, i) => ({
			value: (2010 + i).toString(),
			label: (2010 + i).toString(),
		})),
];

export default audienceList;
