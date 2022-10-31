import type { MapFeature } from "@/components/Event/MapSection";

export const Map = ({ location }: { location: MapFeature }) => {
  return (
    <iframe
      width="100%"
      height="100%"
      frameBorder="0"
      scrolling="no"
      marginHeight={0}
      marginWidth={0}
      src={`https://maps.google.com/maps?q=${location.properties.name}%20${location.properties.context}&z=14&amp&output=embed`}
    ></iframe>
  );
};
