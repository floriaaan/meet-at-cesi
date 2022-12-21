import { Chip, ChipProps } from "@/components/UI/Chip";
import classNames from "classnames";
import { MdClose } from "react-icons/md";

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
			{/* <button className="bg-white py-0.5 h-fit hover:bg-black hover:text-white text-black">
				<MdClose className="w-4 h-4 shrink-0" />
			</button> */}
		</div>
	);
};
