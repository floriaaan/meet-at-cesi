import { EventListItem } from "@/components/Event/List/ListItem";
import { Chip } from "@/components/UI/Chip";
import { ExtendedEvent } from "@/types/Event";

type CreatedSectionProps = {
  events: ExtendedEvent[];
};
export const CreatedSection = ({ events }: CreatedSectionProps) => {
  return (
    <section
      className="flex flex-col w-full px-1 py-2 gap-y-2 scroll-mt-48"
      id="created-events"
      aria-label="Created events section"
    >
      <div className="inline-flex items-center gap-2">
        <h3 className="text-xl font-bold">{"J'organise ces événements"}</h3>
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
          {"Vous n'avez pas encore organisé d'événement."}
        </p>
      )}
    </section>
  );
};
