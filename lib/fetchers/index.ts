import {
  createComment,
  deleteComment,
  editComment,
} from "@/lib/fetchers/comment";
import { createReport } from "@/lib/fetchers/report";
import { createFeedback } from "@/lib/fetchers/feedback";
import {
  createInvitation,
  acceptInvitation,
  declineInvitation,
  deleteInvitation,
} from "@/lib/fetchers/invitation";
import {
  searchUsers,
  deleteImage,
  editPreferences,
  uploadImage,
  getPreferences,
  sendVerificationEmail,
} from "@/lib/fetchers/user";
import {
  participate,
  createEvent,
  deleteEvent,
  editEvent,
  search,
} from "@/lib/fetchers/event";


export {
  // COMMENT
  createComment,
  deleteComment,
  editComment,
  // REPORT
  createReport,
  // FEEDBACK
  createFeedback,
  // INVITATION
  createInvitation,
  acceptInvitation,
  declineInvitation,
  deleteInvitation,
  // USER
  searchUsers,
  deleteImage,
  editPreferences,
  getPreferences,
  uploadImage,
  sendVerificationEmail,
  // EVENT
  participate,
  createEvent,
  deleteEvent,
  editEvent,
  search,
};
