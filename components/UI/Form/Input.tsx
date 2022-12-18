import classNames from "classnames";
import { FieldHookConfig, useField } from "formik";
import { ReactNode } from "react";
import { MdError } from "react-icons/md";

type InputProps = FieldHookConfig<string> & {
	label: string;
	labelClassName?: string;
	inputClassName?: string;
	inputExtraClassName?: string;
	errorClassName?: string;
	type: string;
	icon?: ReactNode;
	canHaveError?: boolean;
};

const Input = ({
	label,
	labelClassName,
	inputClassName,
	inputExtraClassName,
	errorClassName,
	type,
	className = "",
	icon,
	canHaveError = true,
	...props
}: InputProps) => {
	const [field, meta, helpers] = useField(
		props as FieldHookConfig<any>
	) as unknown as [
		field: any,
		meta: {
			value: string;
			error: string;
			touched: boolean;
		},
		helpers: any
	];
	const error = meta.touched && canHaveError ? meta.error : "";

	return (
		<div className={classNames(className, "flex flex-col gap-y-1")}>
			{label ? (
				<label
					htmlFor={field.name}
					className={labelClassName || "font-bold text-black font-body"}
				>
					{label}
				</label>
			) : null}

			<div className="flex-1">
				<div className="relative">
					{type !== "textarea" ? (
						<input
							{...field}
							id={field.name}
							type={type}
							{...(type === "checkbox" ? { checked: field.value } : {})}
							className={
								inputClassName ||
								classNames(
									" py-1.5 lg:py-3 px-3 focus:outline-none text-[16px] sm:text-sm grow placeholder:italic transition disabled:opacity-50 disabled:cursor-not-allowed w-full border placeholder:text-sm",
									error
										? "border-red-400 text-red-800 focus:border-red-400 pr-10 focus:ring-red-400"
										: "border-gray-300 focus:border-gray-400 focus:ring-gray-400",
									inputExtraClassName
								)
							}
							{...props}
						/>
					) : (
						<textarea
							{...field}
							{...props}
							id={field.name}
							className={classNames(
								" py-1.5 lg:py-3 px-3 focus:outline-none text-[16px] sm:text-sm grow placeholder:italic transition disabled:opacity-50 disabled:cursor-not-allowed w-full border placeholder:text-sm",
								error
									? "border-red-400 text-red-800 focus:border-red-400 pr-10 focus:ring-red-400"
									: "border-gray-300 focus:border-gray-400 focus:ring-gray-400"
							)}
						/>
					)}

					{error && type !== "number" ? (
						<span
							className={classNames(
								"absolute  pr-2 ",
								type !== "textarea"
									? "-translate-y-1/2 top-1/2 right-0"
									: " top-2 right-0"
							)}
						>
							<MdError className="w-4 h-4 text-red-500 lg:w-6 lg:h-6" />
						</span>
					) : icon ? (
						<span className="absolute right-0 pr-2 -translate-y-1/2 top-1/2">
							{icon}
						</span>
					) : null}
				</div>
			</div>

			{error && (
				<p
					className="text-sm text-red-600 first-letter:uppercase"
					data-testid="input-error"
				>
					{error}
				</p>
			)}
		</div>
	);
};

export default Input;
