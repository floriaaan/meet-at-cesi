import { MapFeature } from "@/types/Event";

/**
 *	Converts a location string to coordinates using the API Adresse Data Gouv API
 * 
 * @param {string} location
 * @returns {[number, number]} [lat, lng]
 */
export const getCoordinates = async (
	location: string,
): Promise<[number, number]> => {
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
};
