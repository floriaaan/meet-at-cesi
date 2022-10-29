import type { Event, User } from "@prisma/client";
import classNames from "classnames";
import { EventListItem } from "./ListItem";

type ExtendedEvent = Event & {
  creator: User;
  participants: User[];
};

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
