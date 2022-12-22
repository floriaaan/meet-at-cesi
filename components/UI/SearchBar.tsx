import classNames from "classnames";
import { MdSearch } from "react-icons/md";

import { Spinner } from "@/components/UI/Fallback/Spinner";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {
	className?: string;
	inputClassName?: string;
	buttonClassName?: string;

	inputPaddingClassName?: string;
	buttonPaddingClassName?: string;

	loading?: boolean;
	label?: string | null;
	icon?: boolean;
};

export const SearchBar = ({
	className,
	inputClassName,
	buttonClassName,

	inputPaddingClassName,
	buttonPaddingClassName,

	loading,
	label,
	icon = true,
}: Props) => {
	const { query } = useRouter();
	const { title } = query || {};
	const [value, setValue] = useState(title || "");

	return (
		<>
			{label !== null ? (
				<label
					htmlFor="search"
					className="mr-auto font-bold text-black font-body"
				>
					{label || "Trouvez l'événement qui vous correspond"}
				</label>
			) : null}
			<div
				className={classNames(
					"relative shrink inline-flex ",
					className,
					!className?.includes("rounded-") && "rounded-full",
					!className?.includes("w-") && "w-full",
				)}
			>
				{icon ? (
					<MdSearch className="absolute hidden sm:block w-6 h-6 m-2 pointer-events-none top-1.5 left-2 text-purple" />
				) : null}
				<input
					id="search"
					type="text"
					className={classNames(
						"text-[16px] sm:text-sm placeholder:text-sm grow placeholder:italic focus:outline-none",
						icon ? "sm:pl-12 sm:pr-6" : !inputPaddingClassName ? "sm:px-6" : "",
						inputPaddingClassName,
						!inputPaddingClassName?.includes("py-") && "py-2 sm:py-3",
						!inputPaddingClassName?.includes("px-") && "px-4",
						inputClassName,
						!inputClassName?.includes("rounded-l-") && "rounded-l-full",
					)}
					
					placeholder="Rechercher un événement..."
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<button
					type="submit"
					className={classNames(
						"font-bold font-body shrink-0 btn__colors",
						buttonClassName,
						!buttonClassName?.includes("rounded-r-") &&
							"rounded-r-full sm:pr-8",
						buttonPaddingClassName,
						!buttonPaddingClassName?.includes("py-") && "py-2 sm:py-3",
						!buttonPaddingClassName?.includes("px-") && "px-4 sm:px-6",
					)}
				>
					{loading ? (
						<div className="w-6 h-6 ml-0.5 flex items-center justify-center">
							<Spinner
							//  className="w-6 h-6 ml-0.5 text-black"
							/>
						</div>
					) : (
						"GO"
					)}
				</button>
			</div>
		</>
	);
};
