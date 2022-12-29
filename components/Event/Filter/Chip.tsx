import { Chip, ChipProps } from "@/components/UI/Chip";
import classNames from "classnames";

type FilterChipProps = ChipProps & {
	type: "campus" | "promotion" | "dateMin" | "dateMax";
};
export const FilterChip = ({
	children,
	extendClassName,
	type,
}: FilterChipProps) => {
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
		</div>
	);
};
