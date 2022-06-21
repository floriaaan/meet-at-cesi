import classNames from "classnames";
import { Event } from "types/Event";
import { EventLink } from "./Link";

interface EventListProps {
  events: Event[];
  height?: string;
}

export const EventList = ({ events, height = "h-full" }: EventListProps) => {
  return (
    <div className={classNames(height, "overflow-y-scroll space-y-3 snap-y")}>
      {events.map((event, key) => (
        <EventLink {...event} key={event._id + key} />
      ))}
    </div>
  );
};
