import { useContext, createContext, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import toastStyle from "@/resources/toast.config";
import {
	deleteNotification,
	getNotifications,
	readAllNotifications,
	readNotification,
} from "@/lib/fetchers/user";
import { ExtendedNotification } from "@/types/Notification";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const NotificationsContext = createContext({});

type NotificationsContextType = {
	notifications: ExtendedNotification[];
	read: (notificationId: string) => Promise<void>;
	readAll: () => Promise<void>;
	remove: (notificationId: string) => Promise<void>;
	isLoaded: boolean;
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
	const { status } = useSession();

	const [isLoaded, setIsLoaded] = useState(false);
	const [n, setNotifications] = useState<ExtendedNotification[]>([]);

	const intervalRef = useRef<NodeJS.Timer>();
	const router = useRouter();

	const read = async (notificationId: ExtendedNotification["id"]) => {
		let toastId = toast.loading("Chargement... ⌛️", toastStyle);
		const url = await readNotification(notificationId);
		if (url) {
			toast.success("Notification lue 👍", { id: toastId });
			router.push(url);
		} else {
			toast.error("Une erreur est survenue 😢", { id: toastId });
		}
	};

	const readAll = async () => {
		let toastId = toast.loading("Chargement... ⌛️", toastStyle);
		const result = await readAllNotifications();
		if (result) {
			setNotifications((n) => n.map((n) => ({ ...n, read: true })));
			toast.success("Toutes les notifications ont été lues 👍", {
				id: toastId,
			});
		} else {
			toast.error("Une erreur est survenue 😢", { id: toastId });
		}
	};

	const remove = async (notificationId: ExtendedNotification["id"]) => {
		let toastId = toast.loading("Chargement... ⌛️", toastStyle);

		const result = await deleteNotification(notificationId);
		if (result) {
			setNotifications((n) => n.filter((n) => n.id !== notificationId));
			toast.success("Notification supprimée 👍", { id: toastId });
		} else {
			toast.error("Une erreur est survenue 😢", { id: toastId });
		}
	};

	useEffect(() => {
		if (status !== "authenticated") return;

		// get notifications on mount
		getNotifications().then((notifications) => {
			setNotifications(notifications);
			setIsLoaded(true);
		});

		// polling notifications every 15 seconds with a check if the user is on the browser tab
		intervalRef.current = setInterval(async () => {
			if (!document.hidden && status === "authenticated") {
				const notifications = await getNotifications();
				setNotifications(notifications);
				setIsLoaded(true);
			}
		}, 15000);

		return () => clearInterval(intervalRef.current);
	}, [status]);

	return (
		<NotificationsContext.Provider
			value={{
				notifications: n,
				read,
				readAll,
				remove,
				isLoaded,
			}}
		>
			{children}
		</NotificationsContext.Provider>
	);
};
