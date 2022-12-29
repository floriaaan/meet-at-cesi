export const cryptoRandomString = (length: number): string => {
	return crypto.randomUUID().replace(/-/g, "").slice(0, length);
};
