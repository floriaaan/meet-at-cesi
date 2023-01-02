import type { User } from "@prisma/client";
import { AvatarWithName } from "@/components/UI/Avatar";

export const ParticipantCard = ({ participant }: { participant: User }) => {
	return (
		<div
			className={
				"inline-flex items-center w-full h-fit gap-x-2 border-b pb-2 last:border-b-0"
			}
		>
			<AvatarWithName
				direction="row"
				user={participant}
				avatarClassName="w-6 h-6 text-xs"
			/>
		</div>
	);
};

export const InvitationReceiverCard = ({ receiver }: { receiver: User }) => {
	return (
		<div
			className={
				"inline-flex items-center justify-between w-full h-fit gap-x-2 border-b pb-2 last:border-b-0 opacity-50"
			}
		>
			<AvatarWithName
				direction="row"
				user={receiver}
				avatarClassName="w-6 h-6 text-xs"
			/>
			<span className="text-xs">invité.e</span>
		</div>
	);
};
