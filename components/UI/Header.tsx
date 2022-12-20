import classNames from "classnames";
import { ReactNode, useRef, useState } from "react";

type HeaderProps = {
	text: string | ReactNode;
	className?: string;
	containerClassName?: string;
	textCanOverflow?: boolean;
};

export const Header = ({
	text,
	className,
	containerClassName,
	textCanOverflow = false,
}: HeaderProps) => {
	const ref = useRef<HTMLHeadingElement>(null);
	const isClamped =
		(ref.current?.scrollHeight || 0) - 16 > (ref.current?.clientHeight || 1);
	const [isFullTextVisible, setIsFullTextVisible] = useState(isClamped);
	return (
		<div
			className={classNames(
				"w-full p-6 pb-8 flex flex-col",
				containerClassName,
				!containerClassName?.includes("bg-") ? "text-black bg-primary" : "",
			)}
		>
			{textCanOverflow && isClamped && (
				<>
					<button
						className="inline-flex items-center font-bold underline gap-x-1"
						onClick={() => setIsFullTextVisible(!isFullTextVisible)}
					>
						{isFullTextVisible ? "Voir plus" : "Voir moins"}
					</button>
					{isFullTextVisible && <p className="mb-2 text-xs">{text}</p>}
				</>
			)}
			<h1
				ref={ref}
				className={classNames(
					"relative font-bold leading-none  font-heading line-clamp-3 z-[0]",
					"before:block before:absolute before:-bottom-2 md:before:bottom-2 before:left-2 md:before:left-6 before:bg-white before:w-32 before:h-3 before:z-[-1]",
					className,
					className?.includes("text-") ? "" : "text-[4rem]",
				)}
			>
				{text}
			</h1>
		</div>
	);
};
