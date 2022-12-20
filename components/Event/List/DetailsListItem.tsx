type DetailsListItemProps = {
	icon: React.ReactNode;
	value: React.ReactNode;
};
export const DetailsListItem = ({ icon, value }: DetailsListItemProps) => (
	<li className="flex items-center gap-x-1">
		{icon}
		<span className="text-xs text-black">{value}</span>
	</li>
);
