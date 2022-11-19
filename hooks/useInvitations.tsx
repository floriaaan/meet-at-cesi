import { useContext, createContext, useState, Dispatch } from "react";
import toast from "react-hot-toast";

import { ExtendedUser } from "@/types/User";
import {
  acceptInvitation,
  declineInvitation,
  deleteInvitation,
} from "@/lib/fetchers";
import toastStyle from "@/resources/toast.config";

const InvitationsContext = createContext({});

type InvitationsContextType = {
  receivedInvitations: ExtendedUser["receivedInvitations"];
  setReceivedInvitations: Dispatch<ExtendedUser["receivedInvitations"]>;

  sendedInvitations: ExtendedUser["receivedInvitations"];
  setSendedInvitations: Dispatch<ExtendedUser["receivedInvitations"]>;

  accept: (invitationId: string) => Promise<void>;
  decline: (invitationId: string) => Promise<void>;
  remove: (invitationId: string) => Promise<void>;
};

export const useInvitations = () => {
  const context = useContext(InvitationsContext);

  if (context === undefined) {
    throw new Error("useInvitations must be used within a InvitationsProvider");
  }

  return context as InvitationsContextType;
};

type Props = {
  children: React.ReactNode;
  initialReceivedInvitations: ExtendedUser["receivedInvitations"];
  initialSendedInvitations: ExtendedUser["sendedInvitations"];
};

export const InvitationsProvider = ({
  children,
  initialReceivedInvitations,
  initialSendedInvitations,
}: Props) => {
  const [receivedInvitations, setReceivedInvitations] = useState(
    initialReceivedInvitations
  );
  const [sendedInvitations, setSendedInvitations] = useState(
    initialSendedInvitations
  );

  const accept = async (id: string) => {
    const result = await acceptInvitation(id);
    if (result) {
      toast.success("Invitation acceptée 👍", toastStyle);
      setReceivedInvitations(
        receivedInvitations.filter((invitation) => invitation.id !== id)
      );
    } else toast.error("Une erreur est survenue 😕", toastStyle);
  };

  const decline = async (id: string) => {
    const result = await declineInvitation(id);
    if (result) {
      toast.success("Invitation refusée 😉", toastStyle);
      setReceivedInvitations(
        receivedInvitations.filter((invitation) => invitation.id !== id)
      );
    } else toast.error("Une erreur est survenue 😕", toastStyle);
  };

  const remove = async (id: string) => {
    const result = await deleteInvitation(id);
    if (result) {
      toast.success("Invitation supprimée 😉", toastStyle);
      setSendedInvitations(
        sendedInvitations.filter((invitation) => invitation.id !== id)
      );
    } else toast.error("Une erreur est survenue 😕", toastStyle);
  };

  return (
    <InvitationsContext.Provider
      value={{
        receivedInvitations,
        setReceivedInvitations,

        sendedInvitations,
        setSendedInvitations,

        accept,
        decline,
        remove,
      }}
    >
      {children}
    </InvitationsContext.Provider>
  );
};
