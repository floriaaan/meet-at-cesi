import {
	useContext,
	createContext,
	useState,
	Dispatch,
	useEffect,
} from "react";
import toast from "react-hot-toast";

import { ExtendedUser } from "@/types/User";
import toastStyle from "@/resources/toast.config";
import { getNotifications } from "@/lib/fetchers/user";
import { ExtendedNotification } from "@/types/Notification";
import { useSession } from "next-auth/react";

const NotificationsContext = createContext({});

type NotificationsContextType = {
	notifications: ExtendedUser["notifications"];
	remove: (notificationId: string) => Promise<void>;
};

export const useNotifications = () => {
	const context = useContext(NotificationsContext);

	if (context === undefined) {
		throw new Error(
			"useNotifications must be used within a NotificationsProvider",
		);
	}

	return context as NotificationsContextType;
};

type Props = {
	children: React.ReactNode;
};

export const NotificationsProvider = ({ children }: Props) => {
	const { data: session, status } = useSession();

	const [notifications, setNotifications] = useState<ExtendedNotification[]>(
		[],
	);

	const remove = async (id: string) => {
		const result = await (() => {
			return Promise.resolve(false);
		})();
		if (result) {
			toast.success("Notification supprimée 😉", toastStyle);
			// setNotifications(result);
		} else toast.error("Une erreur est survenue 😕", toastStyle);
	};

	useEffect(() => {
		// polling notifications every 30 seconds with a check if the user is on the browser tab
		const interval = setInterval(() => {
			if (!document.hidden && status === "authenticated" && session?.user) {
				getNotifications().then(setNotifications);
			} else console.log("not polling notifications");
		}, 15000);

		return () => clearInterval(interval);
	}, [status, session?.user]);

	return (
		<NotificationsContext.Provider
			value={{
				notifications,
				remove,
			}}
		>
			{children}
		</NotificationsContext.Provider>
	);
};
