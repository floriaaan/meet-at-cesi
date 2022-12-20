import { fromLocalDate } from "@/lib/date";

export const DateComponent = ({ date }: { date: Date }) => {
	return (
		<div
			className={
				"flex flex-col shrink-0 items-center justify-center min-w-[7rem] w-auto h-24 md:h-auto px-4 md:min-h-max bg-black aspect-video md:aspect-square"
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
		</div>
	);
};
