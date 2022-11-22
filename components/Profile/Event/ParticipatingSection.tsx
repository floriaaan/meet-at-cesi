import { EventListItem } from "@/components/Event/List/ListItem";
import { Chip } from "@/components/UI/Chip";
import { ExtendedEvent } from "@/types/Event";

type ParticipatingSectionProps = {
  events: ExtendedEvent[];
};
export const ParticipatingSection = ({ events }: ParticipatingSectionProps) => {
  return (
    <section
      className="flex flex-col w-full px-1 py-2 gap-y-2 scroll-mt-48"
      id="participating-events"
      aria-label="Participating events section"
    >
      <div className="inline-flex items-center gap-2">
        <h3 className="text-xl font-bold">Je participe à ces événements</h3>
        <Chip>{events.length}</Chip>
      </div>
      {events.length > 0 ? (
        <div className="flex w-full gap-2 pb-1 overflow-y-auto max-h-64">
          {events.map((event) => (
            <EventListItem {...event} key={event.id} />
          ))}
        </div>
      ) : (
        <p className="text-sm">
          {"Vous ne participez pas à un événement à venir."}
        </p>
      )}
    </section>
  );
};
