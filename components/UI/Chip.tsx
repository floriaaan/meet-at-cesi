import classNames from "classnames";

export type ChipProps = {
	children: React.ReactNode;
	className?: string;
	extendClassName?: string;
};

export const Chip = ({ children, className, extendClassName }: ChipProps) => {
	return (
		<span
			data-testid="chip"
			className={
				className ||
				classNames(
					"font-bold text-white bg-black py-0.5 px-2",
					!extendClassName?.includes("text-") ? "text-xs" : "",
					extendClassName,
				)
			}
		>
			{children}
		</span>
	);
};
