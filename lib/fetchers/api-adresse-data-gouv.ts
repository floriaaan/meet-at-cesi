import { MapFeature } from "@/types/Event";
import { log } from "@/lib/log";

/**
 *	Converts a location string to coordinates using the API Adresse Data Gouv API
 *
 * @param {string} location
 * @returns {[number, number]} [lat, lng]
 */
export const getCoordinates = async (
	location: string,
): Promise<[number, number]> => {
	try {
		const {
			features: [
				{
					geometry: { coordinates },
				},
			],
		} = (await (
			await fetch(`https://api-adresse.data.gouv.fr/search/?q=${location}`)
		).json()) as { features: MapFeature[] };

		// return [lat, lng]
		return [coordinates[1], coordinates[0]];
	} catch (error) {
		log.error(error);
		return [] as unknown as [number, number];
	}
};
