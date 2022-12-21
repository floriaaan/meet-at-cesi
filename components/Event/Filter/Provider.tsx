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

export const FilterProvider = ({ children }: { children: ReactNode }) => {
	const [filters, setFilters] = useState<FilterValues>(DEFAULT_INITIALS);
	const { query } = useRouter();

	useEffect(() => {
		if (query && Object.keys(query).length > 0) {
			setFilters({
				dateMin: (query.dateMin as unknown as Date) || DEFAULT_INITIALS.dateMin,
				dateMax: (query.dateMax as unknown as Date) || DEFAULT_INITIALS.dateMax,
				campus: (query.campus as string) || DEFAULT_INITIALS.campus,
				promotion: (query.promotion as string) || DEFAULT_INITIALS.promotion,
			} as FilterValues);
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
