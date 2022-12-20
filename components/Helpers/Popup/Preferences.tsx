import { Preference } from "@prisma/client";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import classNames from "classnames";

import {
	PreferencesForm,
	PreferencesFormValues,
} from "@/components/Profile/Preferences/Form";
import { editPreferences, getPreferences } from "@/lib/fetchers";
import { MdClose } from "react-icons/md";
import { EditPreferencesRequestInput } from "@/lib/fetchers/user";

export const PreferencesPopup = () => {
	const [cookie, setCookie] = useCookies([
		"meet-preferences",
		"meet-preferences_dismissed",
	]);
	const {
		"meet-preferences": cookiePreferences,
		"meet-preferences_dismissed": cookieDismissed,
	} = cookie;
	const [preferences, setPreferences] = useState<Preference | undefined>(
		cookiePreferences !== "undefined" ? cookiePreferences : undefined,
	);
	const [dismissed, setDismissed] = useState<boolean>(
		cookieDismissed === "true" || false,
	);

	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		setPreferences(
			cookiePreferences !== "undefined" ? cookiePreferences : undefined,
		);
		setDismissed(cookieDismissed === "true");
	}, [cookiePreferences, cookieDismissed]);

	useEffect(() => {
		getPreferences().then((preferences) => {
			setLoading(false);
			setPreferences(preferences);
			setCookie("meet-preferences", preferences, { path: "/" });
		});

		// disabled eslint warning because setCookie is not a dependency
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const dismiss = () => {
		setDismissed(true);
		setCookie("meet-preferences_dismissed", "true", { path: "/" });
	};

	//#region render

	async function handleSubmit(values: PreferencesFormValues) {
		dismiss();
		return editPreferences(values as EditPreferencesRequestInput);
	}

	/**
	 * Display options
	 *
	 */
	const show = !(preferences || dismissed) && !loading;
	useEffect(() => {
		if (show) {
			document.body.classList.add("blocking__popup");
		} else {
			document.body.classList.remove("blocking__popup");
		}

		return function cleanup() {
			document.body.classList.remove("blocking__popup");
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [show]);

	return show ? (
		<>
			<div
				className={
					"absolute top-0 left-0 z-[42] w-screen h-screen xs:h-0 xs:w-0 bg-black bg-opacity-40 xs:hidden"
				}
				onClick={() => setDismissed(true)}
			></div>
			<div
				className={classNames(
					"fixed bottom-0 left-0 z-50 flex flex-col justify-between w-screen p-4 duration-150 bg-white border-black h-fit xs:shadow-xl xs:border xs:ml-4 xs:max-w-sm lg:max-w-lg xs:w-full xs:top-auto xs:left-auto xs:bottom-4 xs:right-4 xs:z-10 pb-[5.5rem] xs:pb-4",
					show ? "opacity-1" : "opacity-0",
				)}
			>
				<div className="inline-flex items-center justify-between w-full">
					<h4 className="mb-2 font-bold">Définition du campus et promotion</h4>
					<button
						onClick={() => setDismissed(true)}
						className="hidden p-2 xs:block"
					>
						<MdClose />
					</button>
				</div>

				<PreferencesForm
					onSubmit={handleSubmit}
					optionalButton={
						<button
							type="button"
							onClick={dismiss}
							className="pb-2 text-xs underline underline-offset-2"
						>
							Ne plus me demander
						</button>
					}
					submitClassName="w-full btn-black text-sm border-b"
					labelClassName="text-xs font-bold font-black"
				/>
			</div>
		</>
	) : (
		<></>
	);
};
