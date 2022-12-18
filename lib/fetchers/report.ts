import { ReportObject, ReportStatus, ReportType } from "@prisma/client";

export type ReportCreateRequestInput = {
	content: string;
	page: string;
	object: ReportObject;
	objectId: string;
	type: ReportType;
};

export const createReport = async (
	values: ReportCreateRequestInput
): Promise<boolean> => {
	const res = await fetch("/api/report", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(values),
	});
	if (res.ok) return true;
	return false;
};

export type ReportActionRequestInput = {
	reportId: string;
	status: ReportStatus;
};

export const acceptReport = async (reportId: string): Promise<boolean> => {
	const res = await fetch(`/api/report/`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ reportId, status: ReportStatus.ACCEPTED }),
	});
	if (res.ok) return true;
	return false;
};

export const rejectReport = async (reportId: string): Promise<boolean> => {
	const res = await fetch(`/api/report/`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ reportId, status: ReportStatus.REFUSED }),
	});
	if (res.ok) return true;
	return false;
};

export const pendReport = async (reportId: string): Promise<boolean> => {
	const res = await fetch(`/api/report/`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ reportId, status: ReportStatus.PENDING }),
	});
	if (res.ok) return true;
	return false;
};
