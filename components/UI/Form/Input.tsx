import classNames from "classnames";
import { FieldHookConfig, useField } from "formik";
import { ReactNode } from "react";
import { MdError } from "react-icons/md";

type HTMLInputProps = React.DetailedHTMLProps<
	React.InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
>;
type HTMLTextAreaProps = React.DetailedHTMLProps<
	React.TextareaHTMLAttributes<HTMLTextAreaElement>,
	HTMLTextAreaElement
>;

type InputProps = FieldHookConfig<string> & {
	label: string;
	labelClassName?: string;
	inputClassName?: string;
	inputExtraClassName?: string;
	errorClassName?: string;
	type: string;
	icon?: ReactNode;
	canHaveError?: boolean;
} & (HTMLInputProps | HTMLTextAreaProps);

const GlobalInput = ({
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
	const [field, meta] = useField(
		props as FieldHookConfig<HTMLInputElement | HTMLTextAreaElement>,
	) as unknown as [
		field: {
			name: string;
			value: string;
			onChange: (
				e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
			) => void;
			onBlur: (
				e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
			) => void;
		},
		meta: {
			value: string;
			error: string;
			touched: boolean;
		},
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
							{...(type === "checkbox"
								? { checked: field.value as unknown as boolean }
								: {})}
							className={
								inputClassName ||
								classNames(
									" py-1.5 lg:py-3 px-3 focus:outline-none text-[16px] sm:text-sm grow placeholder:italic transition disabled:opacity-50 disabled:cursor-not-allowed  border placeholder:text-sm",
									type === "checkbox" ? "accent-primary" : "w-full",
									error
										? "border-red-400 text-red-800 focus:border-red-400 pr-10 focus:ring-red-400"
										: "border-gray-300 focus:border-gray-400 focus:ring-gray-400",
									inputExtraClassName,
								)
							}
							{...(props as HTMLInputProps)}
						/>
					) : (
						<textarea
							{...field}
							{...(props as HTMLTextAreaProps)}
							id={field.name}
							className={classNames(
								" py-1.5 lg:py-3 px-3 focus:outline-none text-[16px] sm:text-sm grow placeholder:italic transition disabled:opacity-50 disabled:cursor-not-allowed w-full border placeholder:text-sm",
								error
									? "border-red-400 text-red-800 focus:border-red-400 pr-10 focus:ring-red-400"
									: "border-gray-300 focus:border-gray-400 focus:ring-gray-400",
							)}
						/>
					)}

					{error && type !== "number" ? (
						<span
							className={classNames(
								"absolute  pr-2 ",
								type !== "textarea"
									? "-translate-y-1/2 top-1/2 right-0"
									: " top-2 right-0",
								errorClassName,
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

const UncontrolledInput = ({
	label,
	labelClassName,
	inputClassName,
	inputExtraClassName,
	type,
	className = "",
	icon,
	...props
}: InputProps) => {
	return (
		<div className={classNames(className, "flex flex-col gap-y-1")}>
			{label ? (
				<label
					htmlFor={props.name}
					className={labelClassName || "font-bold text-black font-body"}
				>
					{label}
				</label>
			) : null}

			<div className="flex-1">
				<div className="relative">
					{type !== "textarea" ? (
						<input
							{...(props as HTMLInputProps)}
							id={props.name}
							type={type}
							{...(type === "checkbox"
								? { checked: props.value as unknown as boolean }
								: {})}
							className={
								inputClassName ||
								classNames(
									" py-1.5 lg:py-3 px-3 focus:outline-none text-[16px] sm:text-sm grow placeholder:italic transition disabled:opacity-50 disabled:cursor-not-allowed  border placeholder:text-sm",
									type === "checkbox" ? "accent-primary" : "w-full",
									"border-gray-300 focus:border-gray-400 focus:ring-gray-400",
									inputExtraClassName,
								)
							}
						/>
					) : (
						<textarea
							{...(props as HTMLTextAreaProps)}
							id={props.name}
							className={classNames(
								" py-1.5 lg:py-3 px-3 focus:outline-none text-[16px] sm:text-sm grow placeholder:italic transition disabled:opacity-50 disabled:cursor-not-allowed w-full border placeholder:text-sm",
								"border-gray-300 focus:border-gray-400 focus:ring-gray-400",
							)}
						/>
					)}

					{icon ? (
						<span className="absolute right-0 pr-2 -translate-y-1/2 top-1/2">
							{icon}
						</span>
					) : null}
				</div>
			</div>
		</div>
	);
};



export const Input = ({
	uncontrolled = false,
	...props
}: InputProps & { uncontrolled?: boolean }) => {
	return !uncontrolled ? (
		<GlobalInput {...props} />
	) : (
		<UncontrolledInput {...props} />
	);
};
export default Input;
