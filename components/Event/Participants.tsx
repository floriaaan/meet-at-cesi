import { Event } from "types/Event";
import { Avatar } from "components/UI/Avatar/Avatar";

type Props = {
  participants: Event["participants"];
};

export const Participants = ({ participants }: Props) => {
  return (
    <div className="grid w-full grid-cols-3 gap-6">
      {participants.map((participant) => {
        return (
          <div
            className="flex flex-col justify-between h-32"
            key={participant.fullName}
          >
            {participant?.photoURL ? (
              <Avatar
                src={participant.photoURL}
                size="w-24 h-24"
                alt={participant.fullName}
              />
            ) : (
              <span className="w-24 h-24 rounded-full bg-secondary-100"></span>
            )}
            <span className="text-xs text-center">{participant.fullName}</span>
          </div>
        );
      })}
    </div>
  );
};
