type DetailsListItemProps = {
	icon: React.ReactNode;
	value: React.ReactNode;
};
export const DetailsListItem = ({ icon, value }: DetailsListItemProps) => (
	<li className="flex items-start gap-x-1">
		{icon}
		<span className="text-xs text-black dark:text-white">{value}</span>
	</li>
);
