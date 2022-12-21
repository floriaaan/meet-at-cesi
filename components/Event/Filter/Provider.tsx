import { createContext, ReactNode, useContext, useState } from "react";
import {
	DEFAULT_INITIALS,
	FilterValues,
} from "@/components/Event/Filter/Sidebar";

const FilterContext = createContext({});
type FilterContextType = {
	filters: FilterValues;
	setFilters: (filters: FilterValues) => void;
};
export const useFilter = (): FilterContextType =>
	useContext(FilterContext) as FilterContextType;

export const FilterProvider = ({ children }: { children: ReactNode }) => {
	const [filters, setFilters] = useState<FilterValues>(DEFAULT_INITIALS);

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
