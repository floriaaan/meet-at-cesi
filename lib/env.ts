export const getEnv = (): "local" | "development" | "production" => {
	const appEnv = process.env.NEXT_PUBLIC_APP_ENV as
		| "local"
		| "development"
		| "production"
		| undefined;

	if (appEnv === undefined) {
		const nodeEnv = process.env.NODE_ENV;
		if (nodeEnv === "development" || nodeEnv === "production") {
			return nodeEnv;
		}
		return "local";
	}
	if (
		appEnv === "local" ||
		appEnv === "development" ||
		appEnv === "production"
	) {
		return appEnv;
	}
	return "local";
};
