import { ProfileLayoutSidebar } from "@/components/Layout/Profile/Sidebar";
import { ReactNode } from "react";

type Props = { children: ReactNode; noSidebar?: boolean };

export const ProfileLayout = ({ children, noSidebar = false }: Props) => {
	return (
		<div className="flex w-full min-h-full grow" aria-label="Profile wrapper">
			{!noSidebar ? <ProfileLayoutSidebar /> : null}
			<div
				className="flex flex-col w-full h-full overflow-y-auto grow"
				aria-label="Profile main section"
			>
				{children}
			</div>
		</div>
	);
};
