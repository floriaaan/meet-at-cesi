export const getPlural = (count: number, singular: string, plural: string) => {
	if (count === null || count === undefined) return singular;
	if (singular === null || singular === undefined) return "";
	if (plural === null || plural === undefined) return "";
	return `${count > 1 ? plural : singular}`;
};

export const getInitials = (name: string) => {
	if (!name) return "";
	const initials = name
		.split(" ")
		.map((name) => name[0])
		.join("");
	return initials;
};
