import { ReportObject, ReportType } from "@prisma/client";

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
