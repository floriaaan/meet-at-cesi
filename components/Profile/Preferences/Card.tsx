import audienceList from "@/resources/audience-list";
import campusList from "@/resources/campus-list";
import { Preference, PreferencePrivacy } from "@prisma/client";

const getCampusLabel = (campus: string | undefined) =>
  campusList.find((c) => c.value === campus)?.label || "Campus inconnu";

const getPromotionLabel = (promotion: string | undefined) => {
  if (!promotion) return "Promotion inconnue";
  const [audience, year] = promotion.split(":");
  const audienceLabel = audienceList.find(
    (a) => a.value === audience
  )?.shortLabel;
  return `${audienceLabel} ${year}`;
};

export const Preferences = ({ preferences }: { preferences?: Preference }) => {
  const { campus, promotion, privacy } = preferences || {};
  if (preferences === undefined) return null;

  if (privacy === PreferencePrivacy.PRIVATE)
    return <strong>Promotion et campus non disponible</strong>;
  return (
    <div className="flex flex-col truncate md:gap-1 md:flex-row" data-testid="profile-promotion">
      {privacy === PreferencePrivacy.CAMPUS_ONLY ||
      privacy === PreferencePrivacy.PUBLIC ? (
        <strong className="text-sm uppercase truncate md:text-base">
          {getCampusLabel(campus)}
        </strong>
      ) : null}
      {privacy === PreferencePrivacy.PUBLIC ? (
        <span className="hidden md:block">-</span>
      ) : null}
      {privacy === PreferencePrivacy.PROMOTION_ONLY ||
      privacy === PreferencePrivacy.PUBLIC ? (
        <strong className="text-sm uppercase truncate md:text-base">
          {getPromotionLabel(promotion)}
        </strong>
      ) : null}
    </div>
  );
};
