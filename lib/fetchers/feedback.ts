export type FeedbackCreateRequestInput = {
	text: string;
	page: string;
	history: string[];
};
export const createFeedback = async (
	feedback: FeedbackCreateRequestInput
): Promise<boolean> => {
	const res = await fetch("/api/feedback", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(feedback),
	});
	if (res.ok) return true;
	return false;
};
