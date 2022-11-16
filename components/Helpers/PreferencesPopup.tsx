import { Preference } from "@prisma/client";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

import { PreferencesForm } from "@/components/Profile/PreferencesForm";
import { editPreferences, getPreferences } from "@/lib/fetchers";

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
    cookiePreferences || undefined
  );
  const [dismissed, setDismissed] = useState<boolean>(
    cookieDismissed === "true" || false
  );

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

  if (preferences || dismissed) return null;

  return (
    <div className="fixed flex flex-col justify-between p-2 ml-4 bg-white border border-black lg:w-full lg:max-w-md md:w-72 bottom-4 right-4">
      {/* <pre className="text-xs">{JSON.stringify(preferences, undefined, 2)}</pre> */}
      <h4 className="mb-2 font-bold">Définition du campus et promotion</h4>

      <PreferencesForm
        onSubmit={async ({ campus, promotion, promotionYear }) => {
          dismiss();
          return editPreferences({ campus, promotion, promotionYear });
        }}
        optionalButton={
          <button
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
