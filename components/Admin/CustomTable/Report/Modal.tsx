import { Avatar, AvatarWithName, Name } from "@/components/UI/Avatar";
import { Chip } from "@/components/UI/Chip";
import { Modal } from "@/components/UI/Modal";
import { formatDate } from "@/lib/date";
import { reportReasonList } from "@/resources/report-list";
import { ExtendedReport } from "@/types/Report";
import { Comment, Event, ReportObject, User } from "@prisma/client";
import Link from "next/link";
import { MdAccountCircle, MdOutlinedFlag } from "react-icons/md";

type ReportTableModalProps = ExtendedReport & {
  isModalOpen: boolean;
  closeModal: () => void;
};

export const ReportTableModal = ({
  isModalOpen,
  closeModal,
  ...report
}: ReportTableModalProps) => {
  const { sender, related, blamedUser, type, createdAt, object, content } =
    report;

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={`Signalement de ${sender.name} pour ${blamedUser.name}`}
      maxWidth="md:max-w-3xl"
      overflow="overflow-y-auto"
    >
      <div className="grid md:grid-cols-2 gap-x-4 gap-y-2">
        <div className="inline-flex items-center pb-3 border-b gap-x-2 md:col-span-2 border-neutral-300 ">
          <Avatar user={sender} className="w-10 h-10" />
          <div className="flex flex-col">
            <Name user={sender} />
            <p className="text-xs leading-3 text-neutral-500">
              Signalement créé le {formatDate(createdAt)}
            </p>
          </div>
        </div>

        <div className="">
          <p className="inline-flex items-center text-lg font-bold gap-x-1">
            <MdAccountCircle />
            Utilisateur signalé
          </p>
          <AvatarWithName
            user={blamedUser}
            direction="row"
            avatarClassName="w-8 h-8"
          />
        </div>
        <div className="flex flex-col">
          <p className="inline-flex items-center text-lg font-bold gap-x-1">
            <MdOutlinedFlag />
            Objet signalé
          </p>
          <Link
            href={`/${
              object === ReportObject.EVENT || object === ReportObject.COMMENT
                ? "event"
                : "user"
            }/${
              object === ReportObject.COMMENT
                ? `${(related as Comment).eventId}#${related.id}`
                : related.id
            }`}
            className="text-sm text-neutral-700 hover:underline decoration-dashed"
          >
            {object === ReportObject.EVENT ? (related as Event).title : null}
            {object === ReportObject.COMMENT
              ? (related as Comment).content
              : null}
            {object === ReportObject.USER ? (related as User).name : null}
          </Link>
        </div>
        <div className="md:col-span-2">
          <p className="inline-flex items-center text-lg font-bold gap-x-1">
            Type de signalement
          </p>
          <p className="text-sm text-neutral-700">
            {reportReasonList.find((r) => r.value === type)?.label}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="inline-flex items-center text-lg font-bold gap-x-1">
            Contenu
          </p>
          <p className="text-xs text-neutral-700">{content}</p>
        </div>
      </div>
    </Modal>
  );
};
