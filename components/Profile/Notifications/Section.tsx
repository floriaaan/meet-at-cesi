import { useState } from "react";
import { ExtendedUser } from "@/types/User";
import {
	NotificationsForm,
	NotificationsFormValues,
} from "@/components/Profile/Notifications/Form";

export const NotificationsSection = ({ user }: { user: ExtendedUser }) => {
	const [notifications, setNotifications] = useState<
		ExtendedUser["notifications"]
	>(user.notifications || undefined);

	async function handleSubmit(values: NotificationsFormValues) {
		// return editNotifications(values as EditNotificationsRequestInput).then((result) => {
		// 	if (result && !(result instanceof Error)) {
		// 		setNotifications(result.user.notifications);
		// 	}
		// 	return Promise.resolve(result);
		// });
		return Promise.resolve(false as false);
	}

	return (
		<div
			className="flex flex-col w-full p-4 gap-y-2 scroll-mt-48"
			id="notifications"
		>
			<h3 className="text-2xl font-bold">📬 Préférences des notifications</h3>
			<p className="text-sm text-gray-700 whitespace-pre-line">
				{`Vous pouvez choisir de recevoir des notifications par email ou non pour les déclencheurs suivants :`}
			</p>
			<NotificationsForm
				onSubmit={handleSubmit}
				initialValues={{} as NotificationsFormValues}
			/>
		</div>
	);
};
