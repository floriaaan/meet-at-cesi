import type { User } from "@prisma/client";
import { MdFace, MdLocationPin, MdPerson } from "react-icons/md";

import audienceList from "@/resources/audience-list";
import campusList from "@/resources/campus-list";
import { DetailsListItem } from "@/components/Event/List/DetailsListItem";
import { getPlural } from "@/lib/string";

type DetailsListProps = {
  creator: User;
  location: string;
  audience: string;
  audienceCampus: string;
  participants: User[];
};
export const DetailsList = ({
  creator,
  location,
  audience,
  audienceCampus,
  participants,
}: DetailsListProps) => {
  const audienceDisplay = audienceList.find(
    (a) => a.value === audience
  )?.shortLabel;
  const campusDisplay =
    campusList.find((c) => c.value === audienceCampus) || null;
  return (
    <ul className="flex flex-col mt-1 gap-y-1">
      <DetailsListItem
        icon={<MdLocationPin className="w-4 h-4 shrink-0" />}
        value={location}
      />
      {/* <DetailsListItem
          icon={<MdAccountCircle className="w-4 h-4" />}
          value={creator.name}
        /> */}
      <DetailsListItem
        icon={<MdPerson className="w-4 h-4 shrink-0" />}
        value={`${audienceDisplay}${
          campusDisplay ? ` - ${campusDisplay.label}` : ""
        }`}
      />
      <DetailsListItem
        icon={<MdFace className="w-4 h-4 shrink-0" />}
        value={`${participants.length} ${getPlural(
          participants.length,
          "participant inscrit",
          "participants inscrits"
        )}`}
      />
    </ul>
  );
};