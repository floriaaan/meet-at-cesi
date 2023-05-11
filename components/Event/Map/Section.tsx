import { Map } from "@/components/Event/Map";

export const MapSection = ({ location }: { location: string }) => {
	return (
		<div className="w-full p-2 bg-black dark:bg-neutral-900 md:p-4">
			<div className="w-full h-96">
				<Map location={location} />
			</div>
		</div>
	);
};
