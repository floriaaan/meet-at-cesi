import classNames from "classnames";
import Link from "next/link";
import { MdChevronRight } from "react-icons/md";

type StatCardProps = {
	title: string;
	value: string | number;
	colorClassName?: string;
	href?: string;
};

export const StatCard = ({
	title,
	value,
	colorClassName,
	href,
}: StatCardProps) => {
	return (
		<Link href={href || "#"}>
			<div
				className={classNames(
					"flex flex-col relative shrink-0 items-center justify-center min-w-[7rem] w-auto h-24 md:h-auto px-4 md:min-h-max aspect-auto sm:aspect-video md:aspect-square",
					colorClassName || "bg-black dark:bg-neutral-900 text-white",
					href ? "cursor-pointer" : "cursor-default"
				)}
			>
				<span className="text-2xl font-bold leading-4 ">{value}</span>
				<span className="text-xs lowercase">{title}</span>
				{href ? (
					<span
						className={classNames(
							"absolute top-2 right-2",
							colorClassName || "bg-black dark:bg-neutral-900 text-white"
						)}
					>
						<MdChevronRight className="w-4 h-4 shrink-0" />
					</span>
				) : null}
			</div>
		</Link>
	);
};
