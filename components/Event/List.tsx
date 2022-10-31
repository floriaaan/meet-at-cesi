import classNames from "classnames";

import type { ExtendedEvent } from "@/types/Event";
import { EventListItem } from "@/components/Event/ListItem";

type Props = {
  events: ExtendedEvent[];
  className?: string;
};

export const EventList = ({ events, className }: Props) => {
  return (
    <div className={classNames("flex flex-col", className)}>
      {events.map((event) => (
        <EventListItem key={event.id} {...event} />
      ))}
    </div>
  );
};
