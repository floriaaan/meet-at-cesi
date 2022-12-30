import { search } from "@/lib/fetchers";
import { defaultDate } from "@/pages/event";
import { ExtendedEvent } from "@/types/Event";
import { useRouter } from "next/router";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

type Filter = {
	[key: string]: string;
};

const FilterContext = createContext({});
type FilterContextType = {
	filters: Filter;
	events: ExtendedEvent[];
	loading: boolean;
	// setFilters: (filters: Filter) => void;
};
export const useFilter = (): FilterContextType =>
	useContext(FilterContext) as FilterContextType;

export const FilterProvider = ({
	children,
	initialsEvents = [],
}: {
	children: ReactNode;
	initialsEvents: ExtendedEvent[];
}) => {
	const { query, push } = useRouter();
	const [filters, setFilters] = useState<Filter>({});
	const [events, setEvents] = useState<ExtendedEvent[]>(initialsEvents);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (query && Object.keys(query).length > 0) {
			setFilters(query as Filter);
			setLoading(true);
			search(query).then((result) => {
				setEvents(result);
				setLoading(false);
			});
		} else {
			push(
				{
					query: {
						dateMin: defaultDate.toISOString().split("T")[0],
					},
				},
				undefined,
				{ shallow: true },
			);
			setEvents(initialsEvents);
		}
	}, [query, initialsEvents, push]);

	return (
		<FilterContext.Provider value={{ filters, events, loading }}>
			{children}
		</FilterContext.Provider>
	);
};
