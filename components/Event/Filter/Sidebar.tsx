import * as Yup from "yup";

import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { Form, Formik } from "formik";
import { Disclosure } from "@headlessui/react";
import { MdChevronRight } from "react-icons/md";
import classNames from "classnames";

import type { ExtendedEvent } from "@/types/Event";
import { search, EventSearchRequestInput } from "@/lib/fetchers";
import { campusList } from "@/resources/campus-list";
import { audienceList } from "@/resources/audience-list";
import { useFilter } from "@/components/Event/Filter/Provider";
import Select from "@/components/UI/Form/Select";
import Input from "@/components/UI/Form/Input";

type FilterSidebarProps = {
	setEvents: (events: ExtendedEvent[]) => void;
	setLoading: (bool: boolean) => void;
};

type FilterInput = {
	name: string;
	type: string;
	label: string;
	min?: number;
	max?: number;
	options?: { value: string; label: string; [key: string]: any }[];
	defaultValue?: string | number;
	groupBy?: string;
};
type FilterCategory = {
	label: string;
	key: string;
	inputs: FilterInput[];
};

const FILTERS_CATEGORIES: FilterCategory[] = [
	{
		label: "Date de l'événement",
		key: "date",
		inputs: [
			{
				name: "dateMin",
				type: "date",
				label: "À partir du",
				// defaultValue: new Date().toISOString().split("T")[0],
			},
			{ name: "dateMax", type: "date", label: "Jusqu'au" },
		],
	},
	// TODO: prepare the backend to handle this
	// {
	//   label: "Proximité de l'événement",
	//   key: "proximity",
	//   inputs: [{ name: "proximity", type: "range", label: "", min: 0, max: 50 }],
	// },
	{
		label: "Campus de l'événement",
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
		label: "Promotion invitée",
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

const FilterSchema = Yup.object().shape({
	dateMin: Yup.date().nullable(),
	dateMax: Yup.date().nullable(),
	proximity: Yup.number().min(0).max(50),
	campus: Yup.string().nullable(),
	promotion: Yup.string().nullable(),
});

export type FilterValues = Yup.InferType<typeof FilterSchema>;
export const DEFAULT_INITIALS: FilterValues = {
	dateMin: new Date().toISOString().split("T")[0],
	dateMax: undefined,
	proximity: undefined,
	campus: undefined,
	promotion: undefined,
} as unknown as FilterValues;

export const FilterSidebar = ({
	setEvents,
	setLoading,
}: FilterSidebarProps) => {
	const { setFilters } = useFilter();
	const handleChanges = async (values: FilterValues) => {
		setFilters(values);
		setLoading(true);
		const events = await search(values as unknown as EventSearchRequestInput);
		setEvents(events);
		setLoading(false);
	};
	const [smallIsOpen, setSmallIsOpen] = useState<boolean>(false);

	const { query } = useRouter();
	const { campus, promotion } = query as {
		campus?: string;
		promotion?: string;
	};

	const initialValues = {
		...DEFAULT_INITIALS,
		campus,
		promotion,
	} as unknown as FilterValues;

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
			<Formik
				initialValues={initialValues as FilterValues}
				validationSchema={FilterSchema}
				onSubmit={handleChanges}
				validate={handleChanges}
				validateOnBlur={false}
			>
				<Form
					className={classNames(" flex-col p-4 lg:p-0 gap-y-2 bg-gray-100", {
						"hidden lg:flex": !smallIsOpen,
						flex: smallIsOpen,
					})}
				>
					{FILTERS_CATEGORIES.map((category) => (
						<Disclosure
							defaultOpen
							as="div"
							key={`filter-${category.key}`}
							className="border-b border-gray-300 last:border-b-0"
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
									<Disclosure.Panel className="flex flex-col px-4 pb-2 text-sm text-gray-500 gap-y-1 ">
										<hr className="pb-2 mx-3 border-gray-200 " />
										{category.inputs.map((input) => (
											<Fragment key={`filter-${category.key}-${input.name}`}>
												{input.type !== "select" &&
												input.options === undefined ? (
													<Input {...input} />
												) : (
													// @ts-ignore
													<Select
														{...input}
														defaultValue={initialValues[input.name]}
													/>
												)}
											</Fragment>
										))}
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
					))}
				</Form>
			</Formik>
		</div>
	);
};
