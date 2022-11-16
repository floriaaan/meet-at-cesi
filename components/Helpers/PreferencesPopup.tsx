import { Preference } from "@prisma/client";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { PreferencesForm } from "@/components/Profile/PreferencesForm";
import { editPreferences, getPreferences } from "@/lib/fetchers";
import useDelayedRender from "@/hooks/useDelayedRender";
import classNames from "classnames";

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
    cookiePreferences !== "undefined" ? cookiePreferences : undefined
  );
  const [dismissed, setDismissed] = useState<boolean>(
    cookieDismissed === "true" || false
  );

  useEffect(() => {
    setPreferences(
      cookiePreferences !== "undefined" ? cookiePreferences : undefined
    );
    setDismissed(cookieDismissed === "true");
  }, [cookiePreferences, cookieDismissed]);

  useEffect(() => {
    if (!cookiePreferences)
      getPreferences().then((preferences) => {
        setPreferences(preferences);
        setCookie("meet-preferences", preferences, { path: "/" });
      });

    // disabled eslint warning because setCookie is not a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDismissed(cookieDismissed === "true" || false);
  }, [cookieDismissed]);

  const dismiss = () => {
    setDismissed(true);
    setCookie("meet-preferences_dismissed", "true", { path: "/" });
  };

  const show = !(preferences || dismissed);
  const { rendered: isMenuRendered } = useDelayedRender(show, {
    enterDelay: 20,
    exitDelay: 300,
  });

  useEffect(() => {
    if (show) {
      document.body.classList.add("xs:overflow-hidden");
    } else {
      document.body.classList.remove("xs:overflow-hidden");
    }

    return function cleanup() {
      document.body.classList.remove("xs:overflow-hidden");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show) return null;

  return (
    <div
      className={classNames(
        "fixed top-0 left-0 z-50 flex flex-col justify-between w-screen h-screen p-2 duration-150 bg-white border-black xs:h-fit xs:shadow-xl xs:border xs:ml-4 lg:w-full lg:max-w-md xs:w-72 xs:top-auto xs:left-auto xs:bottom-4 xs:right-4 xs:z-10 pb-[5.5rem] xs:pb-2",
        isMenuRendered ? "opacity-0" : "opacity-1"
      )}
    >
      {/* <pre className="text-xs">{JSON.stringify(preferences, undefined, 2)}</pre> */}
      <h4 className="mb-2 font-bold">Définition du campus et promotion</h4>

      <PreferencesForm
        onSubmit={async ({ campus, promotion, promotionYear }) => {
          dismiss();
          return editPreferences({ campus, promotion, promotionYear });
        }}
        optionalButton={
          <button
            type="submit"
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
  );
};
