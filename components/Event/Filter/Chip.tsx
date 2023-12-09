import classNames from "classnames";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/router";

import { Chip, ChipProps } from "@/components/UI/Chip";
import { useFilter } from "@/components/Event/Filter/Provider";

type FilterChipProps = ChipProps & {
	type: "dateMin" | "dateMax" | "proximity" | "campus" | "promotion" | "title";
};
export const FilterChip = ({ children, extendClassName, type }: FilterChipProps) => {
	const { filters } = useFilter();
	const { push } = useRouter();

	function deleteFilter() {
		const newFilters = { ...filters };
		if (type !== "dateMin") {
			delete newFilters[type];
		} else {
			newFilters.dateMin = "";
		}
		push({ query: newFilters }, undefined, { shallow: true });
	}

	return (
		<div className="inline-flex items-center h-8 sm:h-auto last:overflow-hidden">
			<Chip
				extendClassName={classNames(
					"whitespace-nowrap truncate h-full inline-flex items-center",
					{
						"max-w-sm": type === "promotion",
					},
					extendClassName,
				)}
			>
				{children}
			</Chip>
			<button
				onClick={deleteFilter}
				className="flex items-center justify-center w-auto h-8 p-1 text-black bg-white border border-black sm:h-5 dark:text-white dark:bg-black aspect-square hover:bg-black dark:hover:bg-neutral-500 hover:text-white"
			>
				<MdClose  />
			</button>
		</div>
	);
};
