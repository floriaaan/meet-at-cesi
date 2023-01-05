const DEFAULT_ARRAY = Array(2)
	.fill("event-filler#")
	.map((e, i) => e + i);

import { Spinner } from "@/components/UI/Fallback/Spinner";

export const EventListFallback = () => {
	return (
		<>
			{DEFAULT_ARRAY.map((i) => (
				<EventListItemSkeleton key={i} />
			))}
			<p className="text-xs">On fait au plus vite, promis! ⏳</p>
		</>
	);
};

export const EventListItemSkeleton = () => {
	return (
		<div className="flex flex-col overflow-hidden border border-black opacity-75 dark:border-neutral-700 md:flex-row decoration-dashed group">
			<div className="flex flex-col items-center justify-center w-auto h-24 bg-black dark:bg-neutral-700 md:h-auto shrink-0 md:aspect-square gap-y-1 md:w-28">
				<div className="w-8 h-2.5 bg-white dark:bg-black animate-pulse"></div>
				<div className="w-16 h-4 bg-white dark:bg-black animate-pulse"></div>
				<div className="w-24 h-px bg-white dark:bg-black md:w-8 animate-pulse"></div>
				<div className="w-20 h-2 bg-white dark:bg-black animate-pulse"></div>
				<div className="w-8 h-2 bg-white dark:bg-black animate-pulse"></div>
			</div>
			<div className="flex flex-col h-full px-2 py-2.5 gap-y-1">
				<div className="h-5 group-even:w-24 group-odd:w-52 bg-neutral-500 animate-pulse"></div>
				<div className="inline-flex items-center gap-x-1">
					<div className="w-4 h-4 rounded-full bg-neutral-500 animate-pulse shrink-0"></div>
					<div className="w-64 h-4 bg-neutral-500 animate-pulse"></div>
				</div>
				<div className="inline-flex items-center gap-x-1">
					<div className="w-4 h-4 rounded-full bg-neutral-500 animate-pulse shrink-0"></div>
					<div className="w-32 h-4 bg-neutral-500 animate-pulse"></div>
				</div>
				<div className="inline-flex items-center gap-x-1">
					<div className="w-4 h-4 rounded-full bg-neutral-500 animate-pulse shrink-0"></div>
					<div className="w-48 h-4 bg-neutral-500 animate-pulse"></div>
				</div>
				<div className="inline-flex items-center mt-2 gap-x-1">
					<div className="w-8 h-8 rounded-full bg-neutral-500 animate-pulse shrink-0"></div>
					<div className="w-24 h-4 bg-neutral-500 animate-pulse"></div>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center w-8 h-8 ml-auto text-white bg-black border-t border-l border-black dark:bg-white dark:border-white shrink-0 md:border-t-0 md:border-b">
				<Spinner />
			</div>
		</div>
	);
};
