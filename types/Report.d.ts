import { Event, Report, ReportObject } from "@prisma/client";
import { ExtendedUser } from "@/types/User";

export type ExtendedReport = Report & {
  sender: ExtendedUser;
  blamedUser: ExtendedUser;
  related: Event | Comment | User | null;
};
