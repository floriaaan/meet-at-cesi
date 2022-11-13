import { useFetchXHR } from "@/hooks/useFetchXHR";
import { Map } from "@/components/Event/Map";

export type MapFeature = {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    name: string;
    score: number;
    postcode: string;
    city: string;
    context: string;
  };
};

export const MapSection = ({ location }: { location: string }) => {
  // const {
  //   data,
  //   loading,
  //   error,
  // }: {
  //   data?: { features: MapFeature[] };
  //   loading: boolean;
  //   error?: any;
  // } = useFetchXHR(`https://api-adresse.data.gouv.fr/search/?q=${location}`);
  // const fetchedLocation = data?.features[0];

  return (
    <div className="w-full p-4 bg-black">
      <div className="w-full h-96">
        {/* {loading && <p>Chargement...</p>}
        {error && <p>Erreur</p>}
        {fetchedLocation && <Map location={fetchedLocation} />} */}
        <Map location={location} />
      </div>
    </div>
  );
};
