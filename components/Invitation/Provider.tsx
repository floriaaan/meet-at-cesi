import { ExtendedInvitation } from "@/types/Event";
import { createContext, Dispatch, ReactNode, useContext } from "react";

const InvitationContext = createContext({});
type InvitationContextType = {
	setInvitations: Dispatch<ExtendedInvitation[]>;
};

type Props = {
	children: ReactNode;
	setInvitations: Dispatch<ExtendedInvitation[]>;
};

export const InvitationProvider = ({ children, setInvitations }: Props) => {
	return (
		<InvitationContext.Provider value={{ setInvitations }}>
			{children}
		</InvitationContext.Provider>
	);
};

export const useInvitations = (): InvitationContextType => {
	const context = useContext(InvitationContext);

	if (context === undefined) {
		throw new Error("useFilter must be used within a FilterProvider");
	}

	return context as InvitationContextType;
};
