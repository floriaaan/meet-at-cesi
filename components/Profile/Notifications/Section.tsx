import { useState } from "react";
import { ExtendedUser } from "@/types/User";
import {
	NotificationsForm,
	NotificationsFormValues,
} from "@/components/Profile/Notifications/Form";
import {
	editNotificationSettings,
	EditNotificationSettingsRequestInput,
} from "@/lib/fetchers/user";

export const NotificationsSection = ({ user }: { user: ExtendedUser }) => {
	const [settings, setSettings] = useState<
		ExtendedUser["notificationsSettings"]
	>(user.notificationsSettings || undefined);

	async function handleSubmit(values: NotificationsFormValues) {
		return editNotificationSettings(
			values as EditNotificationSettingsRequestInput,
		).then((result) => {
			if (result && !(result instanceof Error)) {
				setSettings(result);
			}
			return Promise.resolve(result);
		});
	}

	return (
		<div
			className="flex flex-col w-full p-4 gap-y-2 scroll-mt-48"
			id="notifications"
		>
			<h3 className="text-2xl font-bold">📬 Préférences des notifications</h3>
			<p className="text-sm text-neutral-700 dark:text-neutral-300  whitespace-pre-line">
				{`Vous pouvez choisir de recevoir des notifications par email ou non pour les déclencheurs suivants :`}
			</p>
			<NotificationsForm
				onSubmit={handleSubmit}
				initialValues={settings as unknown as NotificationsFormValues}
			/>
		</div>
	);
};
