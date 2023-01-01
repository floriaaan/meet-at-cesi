import classNames from "classnames";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/router";

import { Chip, ChipProps } from "@/components/UI/Chip";
import { useFilter } from "@/components/Event/Filter/Provider";

type FilterChipProps = ChipProps & {
	type: "dateMin" | "dateMax" | "proximity" | "campus" | "promotion" | "title";
};
export const FilterChip = ({
	children,
	extendClassName,
	type,
}: FilterChipProps) => {
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
		<div className="inline-flex items-center border border-black last:overflow-hidden">
			<Chip
				extendClassName={classNames(
					extendClassName,
					"whitespace-nowrap truncate",
					{
						"max-w-sm": type === "promotion",
					},
				)}
			>
				{children}
			</Chip>
			<button
				onClick={deleteFilter}
				className="flex items-center justify-center w-auto h-5 p-1 text-black bg-white aspect-square hover:bg-black hover:text-white"
			>
				<MdClose />
			</button>
		</div>
	);
};
