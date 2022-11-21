import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { MdCheck, MdClose } from "react-icons/md";

import type { ExtendedInvitation } from "@/types/Event";
import { Avatar } from "@/components/UI/Avatar";
import { useInvitations } from "@/hooks/useInvitations";
import { Spinner } from "@/components/UI/Spinner";

type InvitationCardProps = {
  invitation: ExtendedInvitation;
  className?: string;
  avatarClassName?: string;
  layout?: "horizontal" | "vertical";
};

/**
 * WATCH OUT: Layout property has two values: "horizontal" and "vertical".
 * If you want to use the Card in an horizontal scroll, use "horizontal" layout.
 * If you want to use the Card in a vertical scroll, use "vertical" layout.
 *
 * @param {InvitationCardProps} props
 * @returns {JSX.Element} InvitationCard
 *
 *
 */
export const InvitationCard = ({
  invitation,
  className,
  avatarClassName,
  layout = "vertical",
}: InvitationCardProps): JSX.Element => {
  const { id, event, sender, receiver } = invitation;
  const { data: session } = useSession();
  const { accept, decline, remove } = useInvitations();
  const [isRequestPending, setIsRequestPending] = useState<boolean>(false);

  const handleAction = async (action: "accept" | "decline" | "remove") => {
    setIsRequestPending(true);
    switch (action) {
      case "accept":
        await accept(id);
        break;
      case "decline":
        await decline(id);
        break;
      case "remove":
        await remove(id);
        break;
      default:
        break;
    }
    setIsRequestPending(false);
  };

  const authenticatedUserIsSender = session?.user?.email === sender.email;
  const displayedUser = authenticatedUserIsSender ? receiver : sender;

  if (layout === "vertical")
    return (
      <div
        className={
          className ||
          "inline-flex items-center w-full shrink-0 border border-black gap-2 divide-x divide-black"
        }
      >
        <Avatar
          user={displayedUser}
          className={
            avatarClassName ||
            "rounded-none bg-black text-white w-auto aspect-square h-[3.25rem] lg:h-full shrink-0 -mr-2 border-0"
          }
        />
        <div className="flex flex-col grow items-start py-2 px-1.5 overflow-hidden">
          <h4 className="text-sm font-bold lg:text-lg whitespace-nowrap">
            {displayedUser.name}
          </h4>
          <p className="inline-flex items-center  overflow-hidden text-xs lg:whitespace-nowrap lg:text-sm w-[-webkit-fill-available]">
            <span className="hidden lg:block">
              {!authenticatedUserIsSender ? "vous a invité à" : "est invité à"}
            </span>
            <Link
              href={`/event/${event.id}`}
              className="font-bold truncate lg:ml-1 decoration-dotted hover:underline w-fit underline-offset-2"
            >
              {event.title}
            </Link>
          </p>
        </div>
        <div className="inline-flex items-center h-full pl-3 mr-3 overflow-hidden shrink-0 gap-x-4">
          {!isRequestPending ? (
            <>
              {authenticatedUserIsSender ? (
                <button
                  className="p-1 text-sm border border-transparent border-dashed hover:border-black"
                  onClick={() => handleAction("remove")}
                >
                  Annuler
                </button>
              ) : (
                <>
                  <button
                    className="inline-flex items-center text-sm"
                    onClick={() => handleAction("decline")}
                  >
                    <MdClose className="w-8 h-8 border border-transparent border-dashed text-red hover:border-red-700 active:text-red-800" />
                  </button>
                  <button
                    className="inline-flex items-center text-sm"
                    onClick={() => handleAction("accept")}
                  >
                    <MdCheck className="w-8 h-8 text-green-500 border border-transparent border-dashed hover:border-green-600 active:text-green-700" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="px-5">
              <Spinner 
              // className="w-6 h-6" 
              />
            </div>
          )}
        </div>
      </div>
    );

  if (layout === "horizontal")
    return (
      <div
        className={
          className ||
          "flex flex-col divide-y divide-black border border-black shrink-0 max-w-[14rem] w-full"
        }
      >
        <Avatar
          user={displayedUser}
          className={
            avatarClassName ||
            "rounded-none bg-black text-white w-full h-auto aspect-video shrink-0 border-0"
          }
        />

        <div className="flex flex-col items-start px-2 py-3">
          <h4 className="text-sm font-bold">{displayedUser.name}</h4>
          <Link
            href={`/event/${event.id}`}
            className="text-xs decoration-dotted hover:underline underline-offset-2"
          >
            {event.title}
          </Link>
        </div>
        <div className="inline-flex justify-end gap-2 p-2 lg:justify-between shrink-0">
          {!isRequestPending ? (
            <>
              {authenticatedUserIsSender ? (
                <button
                  className="text-sm"
                  onClick={() => handleAction("remove")}
                >
                  Annuler
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleAction("decline")}
                    className="inline-flex items-center p-1 text-sm border border-transparent border-dashed text-red hover:border-red-700 gap-x-1 hover:underline underline-offset-2 decoration-red active:text-red-800 active:decoration-red-800"
                  >
                    <MdClose />
                    Refuser
                  </button>
                  <button
                    onClick={() => handleAction("accept")}
                    className="inline-flex items-center p-1 text-sm text-green-500 border border-transparent border-dashed hover:border-green-600 gap-x-1 hover:underline underline-offset-2 decoration-green-500 active:text-green-700 active:decoration-green-700"
                  >
                    <MdCheck />
                    Accepter
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="ml-auto">
              <Spinner className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>
    );

  return <></>;
};
