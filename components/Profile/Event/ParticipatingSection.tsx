import { useRouter } from "next/router";

import { EventListItem } from "@/components/Event/List/ListItem";
import { Chip } from "@/components/UI/Chip";
import { ExtendedEvent } from "@/types/Event";

type ParticipatingSectionProps = {
  events: ExtendedEvent[];
};
export const ParticipatingSection = ({ events }: ParticipatingSectionProps) => {
  const {
    query: { id },
  } = useRouter();
  return (
    <section
      className="flex flex-col w-full px-1 py-2 gap-y-2 scroll-mt-48"
      id="participating-events"
      aria-label="Participating events section"
    >
      <div className="inline-flex items-center gap-2">
        <h3 className="text-xl font-bold">
          {id
            ? "L'utilisateur participe à ces événements"
            : "Je participe à ces événements"}
        </h3>
        <Chip>{events.length}</Chip>
      </div>
      {events.length > 0 ? (
        <div className="flex flex-col w-full gap-2 pb-1 lg:overflow-y-auto lg:max-h-64">
          {events.map((event) => (
            <EventListItem {...event} key={event.id} />
          ))}
        </div>
      ) : (
        <p className="text-sm">
          {id
            ? "L'utilisateur ne participe pas à un événement à venir"
            : "Vous ne participez pas à un événement à venir."}
        </p>
      )}
    </section>
  );
};
