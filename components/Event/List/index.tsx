import classNames from "classnames";

import type { ExtendedEvent } from "@/types/Event";
import { EventListItem } from "@/components/Event/List/ListItem";

type Props = {
  events: ExtendedEvent[];
  className?: string;
};

export const EventList = ({ events, className }: Props) => {
  return (
    <div className={classNames("flex flex-col gap-y-2 mt-4 md:gap-y-4", className)}>
      {events.map((event) => (
        <EventListItem key={event.id} {...event} />
      ))}
    </div>
  );
};
