import { InvitationCard } from "@/components/Profile/Invitation/Card";
import { Chip } from "@/components/UI/Chip";
import { useInvitations } from "@/hooks/useInvitations";

type InviteSectionProps = {
  // initialData: ExtendedUser["receivedInvitations"];
};
export const SendedInvitationSection = ({
}: InviteSectionProps) => {
  const { sendedInvitations: invitations } = useInvitations();

  return (
    <section
      className="flex flex-col w-full px-1 py-2 gap-y-2 scroll-mt-48"
      id="sended-invitations"
      aria-label="Sended invitations section"
    >
      <div className="inline-flex items-center gap-2">
        <h3 className="text-xl font-bold">Invitations envoyées</h3>
        <Chip>{invitations.length}</Chip>
      </div>
      {invitations.length > 0 ? (
        <div className="flex flex-col items-center w-full gap-y-1">
          {invitations.map((invitation) => (
            <InvitationCard
              invitation={invitation}
              key={invitation.id}
              layout="vertical"
            />
          ))}
        </div>
      ) : (
        <p className="text-sm">
          {"Vous n'avez pas encore envoyé d'invitation."}
        </p>
      )}
    </section>
  );
};
