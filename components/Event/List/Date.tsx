import { fromLocalDate } from "@/lib/date";
import { MdLock } from "react-icons/md";

export const DateComponent = ({
	date,
	private: isPrivate,
}: {
	date: Date;
	private: boolean;
}) => {
	return (
		<div
			className={
				"flex relative flex-col shrink-0 items-center justify-center min-w-[7rem] w-auto h-24 md:h-auto px-4 md:min-h-max bg-black dark:md:bg-neutral-700 dark:bg-neutral-900 aspect-video md:aspect-square"
			}
		>
			<span className="text-sm font-bold leading-3 text-white">
				{date.toLocaleDateString("fr-FR", {
					month: "short",
				})}
			</span>
			<>
				<span className="hidden text-xl font-bold text-white md:block">
					{date.toLocaleDateString("fr-FR", {
						day: "numeric",
						weekday: "short",
					})}
				</span>
				<span className="block text-xl font-bold text-white md:hidden">
					{date.toLocaleDateString("fr-FR", {
						day: "numeric",
						weekday: "long",
					})}
				</span>
			</>
			<hr className="w-24 border-white md:w-8" />
			<div className="flex flex-row items-center mt-1 gap-x-1 md:gap-x-0 md:flex-col">
				<span className="text-xs text-white ">
					{date.toLocaleDateString("fr-FR")}
				</span>
				<span className="text-white md:hidden">-</span>
				<span className="text-xs text-white ">
					{fromLocalDate(date).toLocaleTimeString("fr-FR", {
						hour: "numeric",
						minute: "numeric",
					})}
				</span>
			</div>

			{isPrivate && (
				<div className="absolute inline-flex items-center font-bold bottom-0 right-0 text-xs bg-white dark:bg-black px-1 py-0.5 border-b md:border-b-0 md:border-r border-black dark:border-neutral-700">
					<MdLock />
					Privé
				</div>
			)}
		</div>
	);
};
