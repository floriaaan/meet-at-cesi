import { MdDelete } from "react-icons/md";

import { ExtendedUser } from "@/types/User";
import {
  PreferencesForm,
  PreferencesFormValues,
} from "@/components/Profile/Preferences/Form";
import { editPreferences } from "@/lib/fetchers";
import { useState } from "react";
import { EditPreferencesRequestInput } from "@/lib/fetchers/user";
import { PreferencePrivacy } from "@prisma/client";

export const PreferencesSection = ({ user }: { user: ExtendedUser }) => {
  const [preferences, setPreferences] = useState<ExtendedUser["preferences"]>(
    user.preferences || undefined
  );

  async function handleSubmit(values: PreferencesFormValues) {
    return editPreferences(values as EditPreferencesRequestInput).then(
      (result) => {
        if (result && !(result instanceof Error)) {
          setPreferences(result.user.preferences);
        }
        return Promise.resolve(result);
      }
    );
  }

  return (
    <div
      className="flex flex-col w-full p-4 gap-y-2 scroll-mt-48"
      id="preferences"
    >
      <h3 className="text-xl font-bold">
        🎓 Sélection du campus et de la promotion
      </h3>
      <p className="text-sm text-gray-700 whitespace-pre-line">
        {
          "Pour l'instant, il n'est pas possible de sélectionner plusieurs promotions.\n"
        }
        Merci de sélectionner la promotion la plus récente.
      </p>
      <PreferencesForm
        onSubmit={handleSubmit}
        initialValues={
          {
            campus: preferences?.campus || "",
            promotion: preferences?.promotion?.split(":")[0] || "",
            promotionYear: preferences?.promotion?.split(":")[1] || "",
            privacy: preferences?.privacy || PreferencePrivacy.PUBLIC,
          } as PreferencesFormValues
        }
        optionalButton={
          preferences ? (
            <button
              type="button"
              onClick={async () => {
                return editPreferences({
                  campus: "",
                  promotion: "",
                  promotionYear: "",
                  privacy: PreferencePrivacy.PUBLIC,
                }).then((result) => {
                  if (result && !(result instanceof Error)) {
                    setPreferences(result.user.preferences);
                  }
                  return Promise.resolve(result);
                });
              }}
              className="inline-flex items-center gap-1 mb-2 text-xs text-red hover:underline underline-offset-2 decoration-red w-fit"
            >
              <MdDelete />
              Supprimer tout
            </button>
          ) : undefined
        }
      />
    </div>
  );
};
