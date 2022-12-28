import classNames from "classnames";

export type ChipProps = {
	children: React.ReactNode;
	className?: string;
	extendClassName?: string;
	onClick?: Function;
};

export const Chip = ({
	children,
	className,
	extendClassName,
	onClick,
}: ChipProps) => {
	return (
		<span
			onClick={() => onClick && onClick()}
			data-testid="chip"
			className={
				className ||
				classNames(
					"font-bold text-white bg-black  ",
					!extendClassName?.includes("text-") ? "text-xs" : "",
					!extendClassName?.includes("py-") ? "py-0.5" : "",
					!extendClassName?.includes("px-") ? "px-2" : "",
					extendClassName,
					onClick && "cursor-pointer",
				)
			}
		>
			{children}
		</span>
	);
};
