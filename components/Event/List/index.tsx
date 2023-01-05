import classNames from "classnames";

import type { ExtendedEvent } from "@/types/Event";
import { useFilter } from "@/components/Event/Filter/Provider";
import { EventListItem } from "@/components/Event/List/ListItem";
import { EventListFallback } from "@/components/Event/List/Fallback";

type Props = {
	events: ExtendedEvent[];
	className?: string;
};

export const EventList = ({ events, className }: Props) => {
	const { loading } = useFilter();
	return (
		<div
			className={classNames("flex flex-col gap-y-2 mt-4 md:gap-y-4", className)}
		>
			{loading ? (
				<EventListFallback />
			) : (
				<>
					{events.length > 0 ? (
						events.map((event) => <EventListItem key={event.id} {...event} />)
					) : (
						<NoEvents />
					)}
				</>
			)}
		</div>
	);
};

const NoEvents = () => (
	<p className="text-sm">{"Aucun événement correspondant à ces critères."}</p>
);
