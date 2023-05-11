import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { MdChevronRight } from "react-icons/md";
import classNames from "classnames";

import { campusList } from "@/resources/campus-list";
import { audienceList } from "@/resources/audience-list";
import { useFilter } from "@/components/Event/Filter/Provider";
import { Select, Input } from "@/components/UI/Form";

type FilterInput = {
	name: string;
	type: string;
	label: string;
};

type FilterSelectInput = FilterInput & {
	type: "select";
	options: { label: string; value: string; [key: string]: string }[];
	groupBy?: string;
};

type FilterCategory = {
	label: string;
	key: string;
	inputs: (FilterInput | FilterSelectInput)[];
};

const FILTERS_CATEGORIES: FilterCategory[] = [
	{
		label: "🗓️ Date de l'événement",
		key: "date",
		inputs: [
			{ name: "dateMin", type: "date", label: "À partir du" },
			{ name: "dateMax", type: "date", label: "Jusqu'au" },
		],
	},
	{
		label: "🏫 Campus de l'événement",
		key: "campus",
		inputs: [
			{
				name: "campus",
				type: "select",
				label: "",
				options: [{ label: "------", value: "" }, ...campusList],
			},
		],
	},
	{
		label: "🎓 Promotion invitée",
		key: "promotion",
		inputs: [
			{
				name: "promotion",
				type: "select",
				label: "",
				options: [
					{ label: "------", value: "", niveau: "Par défaut" },
					...audienceList,
				],
				groupBy: "niveau",
			},
		],
	},
];

export const FilterSidebar = () => {
	const { push } = useRouter();
	const { filters } = useFilter();
	const [smallIsOpen, setSmallIsOpen] = useState<boolean>(false);

	const handleFilterChange = (
		e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
		input: FilterInput,
	) => {
		const value = e.target.value;
		if (value !== "" && value) {
			push(
				{
					query: {
						...filters,
						[input.name]: value,
					},
				},
				undefined,
				{ shallow: true },
			);
		} else {
			const newFilters = { ...filters };
			delete newFilters[input.name];
			push({ query: newFilters }, undefined, { shallow: true });
		}
	};

	return (
		<div className="flex flex-col p-4 gap-y-4 shrink-0">
			<button
				onClick={() => setSmallIsOpen(!smallIsOpen)}
				className="lg:hidden btn-outline__pill"
			>
				Filtrer la recherche
				<MdChevronRight
					className={`transition-all duration-300 ${
						!smallIsOpen ? "rotate-90 transform" : "-rotate-90"
					} h-5 w-5 text-purple-500`}
				/>
			</button>

			<div
				className={classNames(" flex-col p-4 lg:p-0 gap-y-2 bg-neutral-100 dark:bg-neutral-900", {
					"hidden lg:flex": !smallIsOpen,
					flex: smallIsOpen,
				})}
			>
				{FILTERS_CATEGORIES.map((category) => (
					<Disclosure
						defaultOpen
						as="div"
						key={`filter-${category.key}`}
						className="border-b border-neutral-300 dark:border-neutral-700 last:border-b-0"
					>
						{({ open }) => (
							<>
								<Disclosure.Button className="flex justify-between w-full px-4 py-2 mb-1 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
									<span className="font-bold hover:underline underline-offset-2 decoration-purple">
										{category.label}
									</span>
									<MdChevronRight
										className={`transition-all duration-300 ${
											open ? "rotate-90 transform" : "-rotate-90"
										} h-5 w-5 text-purple-500`}
									/>
								</Disclosure.Button>
								<Disclosure.Panel className="flex flex-col px-4 pb-2 text-sm text-neutral-50 dark:text-neutral-950 gap-y-1 ">
									<hr className="pb-2 mx-3 border-neutral-200 dark:border-neutral-800" />
									{category.inputs.map((input) => (
										<Fragment key={`filter-${category.key}-${input.name}`}>
											{input.type === "select" &&
											(input as FilterSelectInput).options ? (
												<Select
													uncontrolled
													{...(input as FilterSelectInput)}
													onChange={function (
														e: React.ChangeEvent<
															HTMLSelectElement | HTMLInputElement
														>,
													) {
														handleFilterChange(e, input);
													}}
													value={filters[input.name] || ""}
												/>
											) : (
												<Input
													uncontrolled
													{...input}
													onChange={function (
														e: React.ChangeEvent<
															HTMLSelectElement | HTMLInputElement
														>,
													) {
														handleFilterChange(e, input);
													}}
													defaultValue={filters[input.name]}
												/>
											)}
										</Fragment>
									))}
								</Disclosure.Panel>
							</>
						)}
					</Disclosure>
				))}
			</div>
		</div>
	);
};
