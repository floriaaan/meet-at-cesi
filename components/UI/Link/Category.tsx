import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";

export type CategoryOptions = {
	name: string;
	href?: string;
	onClick?: () => void;
	disabled?: boolean;
};

export type CategoryProps = {
	title: string;
	options: CategoryOptions[];
	titleClassName?: string;
};

export const Category = ({ title, options, titleClassName }: CategoryProps) => {
	const { asPath } = useRouter();

	return (
		<div className="flex flex-col gap-y-1">
			<span
				className={classNames(
					"relative font-bold select-none",
					"before:absolute before:bottom-0 before:h-[0.2rem] before:w-8 before:bg-primary",
					titleClassName
				)}
			>
				{title}
			</span>
			<div className="flex flex-col pl-4 gap-y-1">
				{options.map(({ name, href, onClick, disabled }, i) =>
					href ? (
						<Link
							key={`${title}-${i}`}
							href={href}
							className={classNames(
								"p-1 md:p-0 font-normal normal-case nav__link",
								asPath === href && "underline decoration-dotted"
							)}
						>
							{name}
						</Link>
					) : (
						<button
							disabled={disabled || false}
							key={`${title}-${i}`}
							className="p-1 font-normal normal-case md:p-0 nav__link"
							onClick={onClick}
						>
							{name}
						</button>
					)
				)}
			</div>
		</div>
	);
};
