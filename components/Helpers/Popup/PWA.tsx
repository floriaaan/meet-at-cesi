import classNames from "classnames";
import {  useState } from "react";
import { useCookies } from "react-cookie";
import { MdClose,  MdIosShare, MdMoreVert } from "react-icons/md";

export const PWAPopup = ({ isMenuRendered }: { isMenuRendered: boolean }) => {
	const [cookie, setCookie] = useCookies(["meet-pwa_dismissed"]);
	const { "meet-pwa_dismissed": cookieDismissed } = cookie;

	const [dismissed, setDismissed] = useState<boolean>(
		cookieDismissed === "true" || false
	);

	const dismiss = () => {
		setDismissed(true);
		setCookie("meet-pwa_dismissed", "true", { path: "/" });
	};

	return !dismissed ? (
		<div
			className={classNames(
				"fixed bottom-7 left-0 w-full z-[9999] px-7 transition-opacity duration-300 ease-linear",
				isMenuRendered && !dismissed ? "opacity-100" : "opacity-0"
			)}
			style={{ transitionDelay: `${150 + 25 * 5}ms` }}
		>
			<div className="flex flex-col p-3 text-white bg-black gap-y-2">
				<div className="inline-flex justify-between w-full">
					<h3 className="text-xl font-bold">
						Installer {process.env.NEXT_PUBLIC_APP_NAME}
					</h3>
					<button onClick={() => setDismissed(true)}>
						<MdClose className="w-6 h-6" />
					</button>
				</div>
				<p className="text-xs">
					Pour accéder à {process.env.NEXT_PUBLIC_APP_NAME} plus rapidement,
					installez-le sur votre appareil.
				</p>
				<ul className="flex flex-col gap-2">
					<li className="flex flex-col text-xs">
						<span className="inline-flex items-center">
							<strong>Safari (iPhone uniquement)</strong>:
						</span>
						<span className="inline-flex items-center gap-x-1">
							<MdIosShare className="w-4 h-4 text-blue-500" />
							puis {`"Sur l'écran d'accueil"`} puis {`"Ajouter"`}
						</span>
					</li>
					<li className="flex flex-col text-xs">
						<span className="inline-flex items-center">
							<strong>Chrome (Android)</strong>:
						</span>
						<span className="inline-flex items-center gap-x-1">
							<MdMoreVert className="w-4 h-4 " />
							puis {`"Ajouter à l'écran d'accueil"`} puis {`"Ajouter"`}
						</span>
					</li>
				</ul>
				<button
					onClick={dismiss}
					className="px-2 py-2 text-xs underline underline-offset-2 decoration-white"
				>
					Ne plus me demander
				</button>
			</div>
		</div>
	) : null;
};
