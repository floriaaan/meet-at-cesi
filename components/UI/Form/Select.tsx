import classNames from "classnames";
import { FieldHookConfig, useField } from "formik";
import { MdChevronRight } from "react-icons/md";

type SelectProps = FieldHookConfig<string> & {
	labelClassName?: string;
	label: string;
	options: {
		value: string;
		label: string;
		[key: string]: string; // allow any other key to be passed
	}[];
	groupBy?: string; // key of the option object to group by
	canHaveError?: boolean;
} & React.DetailedHTMLProps<
		React.SelectHTMLAttributes<HTMLSelectElement>,
		HTMLSelectElement
	>;

const SelectInput = ({
	label,
	labelClassName,
	className = "",
	options,
	groupBy,
	canHaveError = true,
	...props
}: SelectProps) => {
	const [field, meta] = useField(
		props as FieldHookConfig<HTMLSelectElement>,
	) as unknown as [
		field: {
			name: string;
			value: string;
			onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
			onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
		},
		meta: {
			value: string;
			error: string;
			touched: boolean;
		},
	];
	const error = meta.touched && canHaveError ? meta.error : false;

	return (
		<div className={classNames(className, "flex flex-col space-y-1")}>
			{label ? (
				<label
					htmlFor={field.name}
					className={
						labelClassName || "font-bold text-black dark:text-white font-body"
					}
				>
					{label}
				</label>
			) : null}

			<div className="flex-1">
				<div className="relative">
					<select
						{...field}
						{...props}
						id={field.name}
						className={classNames(
							"py-1.5 lg:py-3 px-3 pr-6 text-black dark:text-white bg-white dark:bg-neutral-700 focus:outline-none appearance-none placeholder:italic transition disabled:opacity-50 disabled:cursor-not-allowed w-full border  text-[16px] sm:text-sm placeholder:text-sm",
							error
								? "border-red-400 text-red-800 focus:border-red-400 focus:ring-red-400"
								: "border-neutral-300 dark:border-neutral-700 focus:border-neutral-400  focus:ring-neutral-400",
						)}
					>
						<SelectChildren options={options} groupBy={groupBy} />
					</select>
					<MdChevronRight className="absolute w-4 h-4 m-2 mr-0 text-black rotate-90 pointer-events-none dark:text-white top-px lg:top-2 right-2" />
				</div>
			</div>

			{error && (
				<p className="text-sm text-red-600 first-letter:uppercase">{error}</p>
			)}
		</div>
	);
};

const UncontrolledSelectInput = ({
	label,
	labelClassName,
	className = "",
	options,
	groupBy,
	...props
}: SelectProps) => {
	return (
		<div className={classNames(className, "flex flex-col space-y-1")}>
			{label ? (
				<label
					htmlFor={props.name}
					className={
						labelClassName || "font-bold text-black dark:text-white font-body"
					}
				>
					{label}
				</label>
			) : null}

			<div className="flex-1">
				<div className="relative">
					<select
						{...props}
						id={props.name}
						className={classNames(
							"py-1.5 lg:py-3 px-3 pr-6 text-black dark:text-white bg-white dark:bg-neutral-700  focus:outline-none appearance-none placeholder:italic transition disabled:opacity-50 disabled:cursor-not-allowed w-full border text-[16px] sm:text-sm placeholder:text-sm",
							"border-neutral-300 dark:border-neutral-700 focus:border-neutral-400  focus:ring-neutral-400",
						)}
					>
						<SelectChildren options={options} groupBy={groupBy} />
					</select>
					<MdChevronRight className="absolute w-4 h-4 m-2 mr-0 text-black rotate-90 pointer-events-none dark:text-white top-px lg:top-2 right-2" />
				</div>
			</div>
		</div>
	);
};

type SelectWrapperProps = SelectProps & {
	uncontrolled?: boolean;
};
export const Select = ({
	uncontrolled = false,
	...props
}: SelectWrapperProps) => {
	return !uncontrolled ? (
		<SelectInput {...props} />
	) : (
		<UncontrolledSelectInput {...props} />
	);
};

const SelectChildren = ({
	groupBy,
	options,
}: {
	groupBy?: string;
	options: { value: string; label: string; [key: string]: string }[];
}) => {
	return (
		<>
			{groupBy === undefined ? (
				<>
					{options
						.sort((a, b) => a.label.localeCompare(b.label))
						.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
				</>
			) : (
				<>
					{(() => {
						const groups = options.reduce((acc, option) => {
							const group = option[groupBy];
							if (acc[group] === undefined) {
								acc[group] = [];
							}
							acc[group].push(option);
							return acc;
						}, {} as { [key: string]: typeof options });

						return Object.keys(groups).map((group) => (
							<optgroup key={group} label={group}>
								{groups[group]
									.sort((a, b) => a.label.localeCompare(b.label))
									.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
							</optgroup>
						));
					})()}
				</>
			)}
		</>
	);
};

export default Select;
