export const Map = ({ location }: { location: string }) => {
	return (
		<iframe
			width="100%"
			height="100%"
			frameBorder="0"
			scrolling="no"
			marginHeight={0}
			marginWidth={0}
			src={`https://maps.google.com/maps?q=${location}&z=14&amp&output=embed`}
		></iframe>
	);
};
