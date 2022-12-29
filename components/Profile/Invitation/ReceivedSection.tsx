import { InvitationCard } from "@/components/Invitation/Card";
import { Chip } from "@/components/UI/Chip";
import { useInvitations } from "@/hooks/useInvitations";

export const ReceivedInvitationSection = () => {
	const { receivedInvitations: invitations } = useInvitations();

	return (
		<section
			className="flex flex-col w-full px-1 py-2 gap-y-2 scroll-mt-48"
			id="received-invitations"
			aria-label="Received invitations section"
		>
			<div className="inline-flex items-center gap-2">
				<h3 className="text-2xl font-bold">🎟️ Invitations reçues</h3>
				<Chip>{invitations.length}</Chip>
			</div>
			{invitations.length > 0 ? (
				<div className="inline-flex items-center w-full max-w-full gap-2 pb-1 overflow-x-auto">
					{invitations.map((invitation) => (
						<InvitationCard
							invitation={invitation}
							key={invitation.id}
							layout="horizontal"
						/>
					))}
				</div>
			) : (
				<p className="text-sm">{"Vous n'avez pas encore reçu d'invitation."}</p>
			)}
		</section>
	);
};
