import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	DEFAULT_INITIALS,
	FilterValues,
} from "@/components/Event/Filter/Sidebar";
import { useRouter } from "next/router";

const FilterContext = createContext({});
type FilterContextType = {
	filters: FilterValues;
	setFilters: (filters: FilterValues) => void;
};
export const useFilter = (): FilterContextType =>
	useContext(FilterContext) as FilterContextType;

type Filter = FilterValues & { title?: string };
export const FilterProvider = ({ children }: { children: ReactNode }) => {
	const [filters, setFilters] = useState<Filter>({
		...DEFAULT_INITIALS,
		title: "",
	} as Filter);
	const { query } = useRouter();

	useEffect(() => {
		if (query && Object.keys(query).length > 0) {
			setFilters({
				dateMin: query.dateMin as unknown as Date,
				dateMax: query.dateMax as unknown as Date,
				campus: query.campus as string,
				promotion: query.promotion as string,
				title: query.title as string,
			} as Filter);
		}
	}, [query]);

	return (
		<FilterContext.Provider
			value={{
				filters,
				setFilters,
			}}
		>
			{children}
		</FilterContext.Provider>
	);
};
