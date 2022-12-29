import { Chip, ChipProps } from "@/components/UI/Chip";
import { cryptoRandomString } from "@/lib/tokens/crypto-random-string";

type ChipListProps = {
	chips: ChipProps[];
};

export const ChipList = ({ chips }: ChipListProps) => {
	return (
		<div className="flex flex-wrap w-full gap-1">
			{chips.map((chip) => (
				<Chip
					{...chip}
					key={`chipList-${
						typeof chip.children === "string"
							? chip.children
							: cryptoRandomString(8)
					}`}
				/>
			))}
		</div>
	);
};
