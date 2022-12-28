import { Chip, ChipProps } from "@/components/UI/Chip";

type ChipListProps = {
	chips: ChipProps[];
};

export const ChipList = ({ chips }: ChipListProps) => {
	return (
		<div className="flex flex-wrap w-full gap-1">
			{chips.map((chip, index) => (
				<Chip {...chip} key={`chipList-${index}`} />
			))}
		</div>
	);
};
