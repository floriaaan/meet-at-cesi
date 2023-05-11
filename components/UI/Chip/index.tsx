import classNames from "classnames";

export type ChipProps = {
	children: React.ReactNode;
	className?: string;
	extendClassName?: string;
	onClick?: () => void;
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
					"font-bold text-white bg-black dark:bg-neutral-800 dark:md:bg-neutral-700 dark:text-white",
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
