import { HiExclamationCircle } from "react-icons/hi2";
import classNames from "classnames";
import { FieldHookConfig, useField } from "formik";
import { useRef, useState } from "react";

import { getPlaceSuggestions } from "@/lib/fetchers";
import { Prediction } from "@/types/Prediction";
import { Spinner } from "@/components/UI/Fallback/Spinner";

type InputProps = FieldHookConfig<string> & {
	labelClassName?: string;
	label: string;
	type: string;
};
type HTMLInputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>;

export const PlaceSearch = ({
	label,
	labelClassName,
	type,
	className = "",
	...props
}: InputProps) => {
	const [field, meta, helpers] = useField(
		props as FieldHookConfig<string>,
	) as unknown as [
		field: {
			name: string;
			value: string;
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
		},
		meta: {
			value: string;
			error: string;
			touched: boolean;
		},
		helpers: {
			setValue: (value: string) => void;
		},
	];
	const error = meta.touched ? meta.error : "";

	const timeout = useRef<NodeJS.Timer>();
	const [suggestions, setSuggestions] = useState<Prediction[]>([]);
	const [preventFromFetching, setPreventFromFetching] =
		useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const [isSearching, setIsSearching] = useState<boolean>(false);

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		field.onChange(e);
		const { value } = e.target;
		setIsSearching(true);

		clearTimeout(timeout.current);

		if (!e.target.value.trim()) {
			setSuggestions([]);
			setIsOpen(false);
			setIsSearching(false);
			return;
		}

		timeout.current = setTimeout(async () => {
			if (!preventFromFetching) {
				const res = await getPlaceSuggestions(value);
				setSuggestions(res);
				setIsOpen(true);
				setIsSearching(false);
			}
		}, 2000);

		setPreventFromFetching(false);
	};

	const handleOnClickSuggestion = (e: React.MouseEvent) => {
		const { innerText } = e.target as HTMLInputElement;
		helpers.setValue(innerText);
		setSuggestions([]);
		setPreventFromFetching(true);
		setIsOpen(false);
	};

	return (
		<div className={classNames(className, "flex flex-col space-y-1 relative")}>
			{label ? (
				<label
					htmlFor={field.name}
					className={labelClassName || "font-bold text-black dark:text-white font-body"}
				>
					{label}
				</label>
			) : null}

			<div className="flex-1">
				<div className="relative">
					<input
						{...field}
						{...(props as HTMLInputProps)}
						onChange={handleOnChange}
						id={field.name}
						type={type}
						className={classNames(
							" py-1.5 lg:py-3 px-3 focus:outline-none text-[16px] sm:text-sm grow placeholder:italic transition disabled:opacity-50 disabled:cursor-not-allowed w-full border placeholder:text-sm",
							error
								? "border-red-400 text-red-800 focus:border-red-400 pr-10 focus:ring-red-400"
								: "border-neutral-300 dark:border-neutral-700 focus:border-neutral-400 dark:border-neutral-600 focus:ring-neutral-400",
						)}
						onBlur={() => setIsOpen(false)}
					/>
					{error && type !== "number" ? (
						<span className="absolute right-0 pr-2 -translate-y-1/2 top-1/2">
							<HiExclamationCircle className="w-4 h-4 text-red-500 lg:w-6 lg:h-6" />
						</span>
					) : isSearching ? (
						<span className="absolute right-0 pr-2 -translate-y-1/2 top-1/2">
							<Spinner
							// className="w-4 h-4 text-black dark:text-white lg:w-6 lg:h-6"
							/>
						</span>
					) : null}
				</div>
			</div>

			{isOpen ? (
				<div className="absolute z-10 flex flex-col w-full -bottom-1 lg:bottom-4">
					{suggestions ? (
						<ul className="absolute w-full p-2 bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 shadow-lg">
							{suggestions.length > 0 ? (
								suggestions.map((s) => (
									<li
										className="inline-flex w-full px-2 py-1 text-xs truncate cursor-pointer select-none hover:bg-neutral-100 dark:bg-neutral-900"
										key={s.place_id}
										onClick={handleOnClickSuggestion}
									>
										{s.description}
									</li>
								))
							) : (
								<li className="flex items-center justify-center h-12 text-xs">Aucun résultat 😣</li>
							)}
						</ul>
					) : null}
				</div>
			) : null}

			{error && (
				<p className="text-sm text-red-600 first-letter:uppercase">{error}</p>
			)}
		</div>
	);
};
