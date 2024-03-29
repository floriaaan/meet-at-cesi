import {
	NotificationSettings,
	Preference,
	PreferencePrivacy,
	User,
	UserPrivacy,
} from "@prisma/client";

import { ExtendedUser } from "@/types/User";
import { RoleFormValues } from "@/components/Admin/CustomTable/User/RoleForm";
import { ExtendedNotification } from "@/types/Notification";

export type UserSearchRequestInput = {
	name?: string;
	offset: number;
};

export const searchUsers = async (
	params: UserSearchRequestInput,
): Promise<User[]> => {
	const response = await fetch(`/api/user/search`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(params),
	});
	if (response.ok) {
		const { users } = await response.json();
		return users;
	}
	return [];
};

export type EditPreferencesRequestInput = {
	campus?: string;
	promotion?: string;
	promotionYear?: string;
	privacy?: PreferencePrivacy;
};
export const editPreferences = async (
	values: EditPreferencesRequestInput,
): Promise<{ user: ExtendedUser } | false> => {
	const response = await fetch(`/api/user/preferences`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
	if (response.ok) {
		const { user } = await response.json();
		return { user };
	}
	return false;
};

export const uploadImage = async (image: string): Promise<string | false> => {
	const res = await fetch("/api/user/image-upload", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ image }),
	});
	const { url } = await res.json();
	if (res.ok) return url;
	return false;
};

export const deleteImage = async (): Promise<boolean> => {
	const res = await fetch("/api/user/image-upload", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (res.ok) return true;
	return false;
};

export const getPreferences = async (): Promise<Preference | undefined> => {
	const res = await fetch("/api/user/preferences");
	const { preferences } = await res.json();
	if (res.ok) return preferences || undefined;
	return undefined;
};

export const sendVerificationEmail = async (): Promise<boolean> => {
	const res = await fetch("/api/user/email-verification", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
	});
	if (res.ok) return true;
	return false;
};

export type ChangeRoleRequestInput = RoleFormValues & { userId: User["id"] };
export const changeRole = async (
	values: ChangeRoleRequestInput,
): Promise<{ user: User } | Error> => {
	const res = await fetch("/api/admin/user/role", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
	const { data, error } = await res.json();
	if (res.ok && res.status === 200) return data;
	return new Error(error.message);
};

export type EditPrivacyRequestInput = {
	trophies: UserPrivacy;
	participations: UserPrivacy;
	createdEvents: UserPrivacy;
};
export const editPrivacy = async (
	values: EditPrivacyRequestInput,
): Promise<{ user: ExtendedUser } | false> => {
	const response = await fetch(`/api/user/privacy`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
	if (response.ok) {
		const { user } = await response.json();
		return { user };
	}
	return false;
};

export const getNotifications = async (): Promise<ExtendedNotification[]> => {
	const res = await fetch("/api/user/notification");
	const { notifications } = await res.json();
	if (res.ok) return notifications;
	return [];
};

export type NotificationRequestInput = {
	id: ExtendedNotification["id"];
};
export const readNotification = async (
	notificationId: ExtendedNotification["id"],
): Promise<string> => {
	const res = await fetch(`/api/user/notification?action=read`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id: notificationId }),
	});
	const { url } = await res.json();
	return url || "/";
};
export const deleteNotification = async (
	notificationId: ExtendedNotification["id"],
): Promise<boolean> => {
	const res = await fetch(`/api/user/notification`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ id: notificationId }),
	});
	if (res.ok) return true;
	return false;
};

export const readAllNotifications = async (): Promise<boolean> => {
	const res = await fetch(`/api/user/notification?action=read-all`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
	});
	if (res.ok) return true;
	return false;
};

export type EditNotificationSettingsRequestInput = {
	EVENT_INVITATION: boolean;
	EVENT_PARTICIPATION: boolean;
	EVENT_CREATION: boolean;
	EVENT_MODIFICATION: boolean;
	EVENT_DELETION: boolean;
	COMMENT_CREATION: boolean;
	REPORT_ACCEPTED: boolean;
	REPORT_REFUSED: boolean;
	FEEDBACK_RESPONSE: boolean;
};
export const editNotificationSettings = async (
	values: EditNotificationSettingsRequestInput,
): Promise<NotificationSettings | false> => {
	const res = await fetch(`/api/user/notification?action=edit-settings`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(values),
	});
	if (res.ok) {
		const { notificationSettings } = await res.json();
		return notificationSettings;
	}
	return false;
};
