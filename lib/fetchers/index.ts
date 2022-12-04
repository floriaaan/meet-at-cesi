import {
  createComment,
  deleteComment,
  editComment,
  CommentCreateRequestInput,
  CommentDeleteRequestInput,
  CommentEditRequestInput,
} from "@/lib/fetchers/comment";
import { createReport, ReportCreateRequestInput } from "@/lib/fetchers/report";
import {
  createFeedback,
  FeedbackCreateRequestInput,
} from "@/lib/fetchers/feedback";
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
  UserSearchRequestInput,
} from "@/lib/fetchers/user";
import {
  participate,
  createEvent,
  deleteEvent,
  editEvent,
  search,
  EventSearchRequestInput,
  getPlaceSuggestions,
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
  getPlaceSuggestions,
};
export type {
  // COMMENT
  CommentCreateRequestInput,
  CommentDeleteRequestInput,
  CommentEditRequestInput,
  // REPORT
  ReportCreateRequestInput,
  // FEEDBACK
  FeedbackCreateRequestInput,
  // USER
  UserSearchRequestInput,
  // EVENT
  EventSearchRequestInput,
};
