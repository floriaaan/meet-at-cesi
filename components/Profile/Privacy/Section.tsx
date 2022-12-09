import { useState } from "react";
import { ExtendedUser } from "@/types/User";
import {
  PrivacyForm,
  PrivacyFormValues,
} from "@/components/Profile/Privacy/Form";
import { editPrivacy, EditPrivacyRequestInput } from "@/lib/fetchers/user";
import { UserPrivacy } from "@prisma/client";

export const PrivacySection = ({ user }: { user: ExtendedUser }) => {
  const [privacy, setPrivacy] = useState<ExtendedUser["privacy"]>(
    user.privacy || undefined
  );

  return (
    <div className="flex flex-col w-full p-4 gap-y-2 scroll-mt-48" id="privacy">
      <h3 className="text-xl font-bold">Confidentialité des données</h3>
      <p className="text-sm text-gray-700 whitespace-pre-line">
        {`Il est possible de choisir quels éléments de votre profil seront affiché.\n
        Votre promotion, votre campus et votre année d'étude sont publics (voir section Sélection du campus et de la promotion).
        Vos trophées, participations aux événements et événements que vous avez créés sont privés par défaut.`}
      </p>
      <PrivacyForm
        onSubmit={async (values) => {
          return editPrivacy(values as EditPrivacyRequestInput).then(
            (result) => {
              if (result && !(result instanceof Error)) {
                setPrivacy(result.user.privacy);
              }
              return Promise.resolve(result);
            }
          );
        }}
        initialValues={
          {
            createdEvents: privacy?.createdEvents || UserPrivacy.PRIVATE,
            participations: privacy?.participations || UserPrivacy.PRIVATE,
            trophies: privacy?.trophies || UserPrivacy.PRIVATE,
          } as PrivacyFormValues
        }
      />
    </div>
  );
};
