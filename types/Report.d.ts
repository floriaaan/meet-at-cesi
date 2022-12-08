import { Event, Report, ReportObject } from "@prisma/client";

export type ExtendedReport = Report & {
  sender: User;
  blamedUser: User;
  related: Event | Comment | User | null;
};
