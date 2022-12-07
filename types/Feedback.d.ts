import { Feedback, User } from "@prisma/client";

export type ExtendedFeedback = Feedback & {
  user: User;
};
