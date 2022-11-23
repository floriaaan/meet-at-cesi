import classNames from "classnames";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { MdClose, MdDownload } from "react-icons/md";

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

  // const [isInstallable, setIsInstallable] = useState<boolean>(false);

  // useEffect(() => {
  //   // check if the browser supports the beforeinstallprompt event
  //   if (window.matchMedia("(display-mode: standalone)").matches) {
  //     setIsInstallable(false);
  //   } else {
  //     window.addEventListener("beforeinstallprompt", (e) => {
  //       e.preventDefault();
  //       setIsInstallable(true);
  //     });
  //   }
  // }, []);

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
        <div className="flex flex-col justify-between w-full gap-2 mt-2">
          <button
            onClick={dismiss}
            className="px-2 py-2 text-xs underline underline-offset-2 decoration-white"
          >
            Ne plus me demander
          </button>
          <button
            disabled
            className="flex items-center justify-center px-4 py-2 text-xs btn__colors"
          >
            <MdDownload className="w-4 h-4" />
            <span className="ml-2">Installer (bientôt)</span>
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
