import cryptoNode from "crypto";
export const cryptoRandomString = (length: number): string => {
	if (typeof window === "undefined" || !("crypto" in window)) {
		return cryptoNode.createHash("sha256").digest("hex").slice(0, length);
	}
	return crypto.randomUUID().replace(/-/g, "").slice(0, length);
};
