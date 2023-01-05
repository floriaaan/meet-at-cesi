import classNames from "classnames";
import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import { usePagination } from "@/hooks/usePagination";

export type Pagination = {
	initialPage: number;
	pageSize: number;
};

export type Column =
	| {
			label: string;
			props?: Partial<JSX.IntrinsicElements["th"]>;
		}
	| string;

export type CustomTableProps = {
	title: string;
	items: unknown[];
	columns: Column[];
	// eslint-disable-next-line no-unused-vars
	renderItem: (item: unknown) => ReactNode;

	pagination?: Pagination;
};

/**
 * Returns a generic custom table
 * Behaves like a table and renders items via the passed render function.
 *
 * See `./pages/admin/even.tsx` for an example.
 *
 */
const CustomTable = ({
	title,
	columns,
	items,
	renderItem,
	pagination,
}: CustomTableProps) => {
	const {
		currentPage,
		totalPages,
		startIndex,
		endIndex,
		setNextPage,
		setPreviousPage,
		nextEnabled,
		previousEnabled,
	} = usePagination({
		totalItems: items.length,
		initialPageSize: pagination?.pageSize || items.length + 1,
		initialPage: pagination?.initialPage || 0,
	});

	const itemsPaginated = items.slice(startIndex, endIndex);

	return (
		<div className="overflow-hidden bg-white border-black border-dashed dark:bg-black dark:border-neutral-800 lg:border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-xl font-bold leading-6 text-black dark:text-white">{title}</h3>

				{pagination ? (
					<div className="inline-flex items-end gap-6">
						<div className="flex flex-col gap-0.5">
							<span className="text-sm font-bold">Page</span>
							<span className="text-xs">
								{currentPage + 1} sur {totalPages}
							</span>
						</div>
						<div className="flex flex-col gap-0.5">
							<span className="text-sm font-bold">Éléments</span>
							<span className="text-xs">
								{startIndex + 1} - {endIndex} sur {items.length}
							</span>
						</div>
						<div className="inline-flex items-center gap-x-2">
							<button
								disabled={!previousEnabled}
								onClick={setPreviousPage}
								className="text-black bg-white border border-black border-dashed dark:text-white dark:border-white hover:bg-primary hover:text-black active:bg-black dark:bg-neutral-900 dark:hover:text-black dark:hover:bg-primary active:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span className="sr-only">Précédent</span>
								<MdChevronLeft className="w-6 h-6" />
							</button>
							<button
								disabled={!nextEnabled}
								onClick={setNextPage}
								className="text-black bg-white border border-black border-dashed dark:bg-neutral-900 dark:text-white dark:border-white hover:bg-primary hover:text-black active:bg-black dark:hover:text-black dark:hover:bg-primary active:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span className="sr-only">Suivant</span>
								<MdChevronRight className="w-6 h-6" />
							</button>
						</div>
					</div>
				) : null}
			</div>
			<div className="border-t border-black border-dashed dark:border-neutral-800">
				<table className="block w-full overflow-x-auto md:table whitespace-nowrap">
					<thead className={classNames("px-4 py-5 bg-neutral-50 dark:bg-neutral-950 md:px-6")}>
						<tr>
							{columns.map((column) => {
								if (typeof column === "object") {
									return (
										<th
											key={column.label}
											{...column.props}
											className={classNames(
												"p-4 text-sm font-medium text-left text-neutral-950 dark:text-neutral-50",
												column.props?.className,
											)}
										>
											{column.label}
										</th>
									);
								}
								return (
									<td
										key={column}
										className="p-4 text-sm font-medium text-left text-neutral-950 dark:text-neutral-50"
									>
										{column}
									</td>
								);
							})}
						</tr>
					</thead>
					<tbody className="w-full">
						{itemsPaginated.map((item) => renderItem(item))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default dynamic(() => Promise.resolve(CustomTable), {
	ssr: false,
});
