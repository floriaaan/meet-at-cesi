import audienceList from "@/resources/audience-list";
import campusList from "@/resources/campus-list";
import { Preference, PreferencePrivacy } from "@prisma/client";

const getCampusLabel = (campus: string | undefined) =>
	campusList.find((c) => c.value === campus)?.label || "Campus inconnu";

const getPromotionLabel = (promotion: string | undefined) => {
	if (!promotion) return "Promotion inconnue";
	const [audience, year] = promotion.split(":");
	const audienceLabel = audienceList.find((a) => a.value === audience)?.label;
	return `${audienceLabel} ${year}`;
};

export const Preferences = ({ preferences }: { preferences?: Preference }) => {
	const { campus, promotion, privacy } = preferences || {};
	if (preferences === undefined) return null;

	if (privacy === PreferencePrivacy.PRIVATE)
		return <strong>Promotion et campus non disponible</strong>;
	return (
		<div
			className="flex flex-col gap-1 mt-2"
			data-testid="profile-promotion"
		>
			{privacy === PreferencePrivacy.PROMOTION_ONLY ||
			privacy === PreferencePrivacy.PUBLIC ? (
				<strong className="pr-6 text-sm uppercase whitespace-pre-line md:leading-4 line-clamp-3 md:text-base">
					{getPromotionLabel(promotion)}
				</strong>
			) : null}
			{privacy === PreferencePrivacy.CAMPUS_ONLY ||
			privacy === PreferencePrivacy.PUBLIC ? (
				<strong className="text-sm uppercase whitespace-pre-line line-clamp-3 md:text-base md:leading-4">
					{getCampusLabel(campus)}
				</strong>
			) : null}
		</div>
	);
};
