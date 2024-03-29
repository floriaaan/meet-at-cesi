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

	async function handleSubmit(values: PrivacyFormValues) {
		return editPrivacy(values as EditPrivacyRequestInput).then((result) => {
			if (result && !(result instanceof Error)) {
				setPrivacy(result.user.privacy);
			}
			return Promise.resolve(result);
		});
	}

	return (
		<div className="flex flex-col w-full p-4 gap-y-2 scroll-mt-48" id="privacy">
			<h3 className="text-2xl font-bold">🔐 Confidentialité des données</h3>
			<p className="text-sm text-neutral-700 dark:text-neutral-300  whitespace-pre-line">
				{`Il est possible de choisir quels éléments de votre profil seront affiché.\n
        Vos trophées, votre promotion, votre campus et votre année d'étude sont publics par défaut.
        Vos participations aux événements et événements que vous avez créés sont privés par défaut.`}
			</p>
			<PrivacyForm
				onSubmit={handleSubmit}
				initialValues={
					{
						createdEvents: privacy?.createdEvents || UserPrivacy.PRIVATE,
						participations: privacy?.participations || UserPrivacy.PRIVATE,
						trophies: privacy?.trophies || UserPrivacy.PUBLIC,
					} as PrivacyFormValues
				}
			/>
		</div>
	);
};
