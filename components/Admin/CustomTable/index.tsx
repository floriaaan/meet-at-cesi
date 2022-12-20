import { usePagination } from "@/hooks/usePagination";
import classNames from "classnames";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ReactNode } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

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
	items: any[];
	columns: Column[];
	renderItem: (item: any) => ReactNode;

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
		<div className="overflow-hidden bg-white border-black border-dashed lg:border">
			<div className="px-4 py-5 sm:px-6">
				<h3 className="text-xl font-bold leading-6 text-black">{title}</h3>

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
								className="text-black border border-black border-dashed hover:bg-primary hover:text-black active:bg-black active:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span className="sr-only">Précédent</span>
								<MdChevronLeft className="w-6 h-6" />
							</button>
							<button
								disabled={!nextEnabled}
								onClick={setNextPage}
								className="text-black border border-black border-dashed hover:bg-primary hover:text-black active:bg-black active:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<span className="sr-only">Suivant</span>
								<MdChevronRight className="w-6 h-6" />
							</button>
						</div>
					</div>
				) : null}
			</div>
			<div className="border-t border-black border-dashed">
				<table className="block w-full overflow-x-auto xl:table whitespace-nowrap">
					<thead className={classNames("px-4 py-5 bg-neutral-50 md:px-6")}>
						<tr>
							{columns.map((column) => {
								if (typeof column === "object") {
									return (
										<th
											key={column.label}
											{...column.props}
											className={classNames(
												"p-4 text-sm font-medium text-left text-neutral-500",
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
										className="p-4 text-sm font-medium text-left text-neutral-500"
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
