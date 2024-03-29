import { search } from "@/lib/fetchers";
import { defaultDate } from "@/pages/event";
import { ExtendedEvent } from "@/types/Event";
import { useRouter } from "next/router";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
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
export const useFilter = (): FilterContextType => {
	const context = useContext(FilterContext);

	if (context === undefined) {
		throw new Error(
			"useFilter must be used within a FilterProvider",
		);
	}

	return context as FilterContextType;
};
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
		if (!Object.keys(query).includes("dateMin"))
			push(
				{
					query: { ...query, dateMin: defaultDate.toISOString().split("T")[0] },
				},
				undefined,
				{ shallow: true },
			);

		if (
			query &&
			Object.keys(query).length !== 0 &&
			query.dateMin !== undefined
		) {
			setFilters(query as Filter);
			setLoading(true);
			search(query).then((result) => {
				setEvents(result);
				setLoading(false);
			});
		}
	}, [query, push]);

	const values = useMemo(
		() => ({ filters, events, loading }),
		[filters, events, loading],
	);

	return (
		<FilterContext.Provider value={values}>{children}</FilterContext.Provider>
	);
};
