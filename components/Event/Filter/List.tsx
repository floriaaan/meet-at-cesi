import { useFilter } from "@/components/Event/Filter/Provider";
import { FilterChip } from "./Chip";

const record = new Map([
	["campus", "Campus"],
	["promotion", "Promotion"],
	["dateMin", "Date de début"],
	["dateMax", "Date de fin"],
	["title", "Titre contient"],
]);

export const FilterList = () => {
	const { filters } = useFilter();
	return (
		<div className="flex flex-wrap gap-1 overflow-hidden whitespace-pre-line">
			{Object.entries(filters).map(([key, value]) => {
				if (value) {
					return (
						<FilterChip
							type={key as "campus" | "promotion" | "dateMin" | "dateMax"}
							key={key}
						>
							<>
								{record.get(key)}: {value}
							</>
						</FilterChip>
					);
				}
			})}
		</div>
	);
};
