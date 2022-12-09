import { Avatar, Name } from "@/components/UI/Avatar";
import { Chip } from "@/components/UI/Chip";
import { Modal } from "@/components/UI/Modal";
import { formatDate } from "@/lib/date";
import { ExtendedFeedback } from "@/types/Feedback";
import { HistoryListItem } from "./HistoryListItem";

type FeedbackTableModalProps = ExtendedFeedback & {
  isModalOpen: boolean;
  closeModal: () => void;
};

export const FeedbackTableModal = ({
  isModalOpen,
  closeModal,
  ...feedback
}: FeedbackTableModalProps) => {
  const { user: creator, createdAt, text, history, id } = feedback;

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={`Feedback de ${creator.name}`}
      maxWidth="md:max-w-lg"
      overflow="overflow-y-auto"
    >
      <div className="grid md:grid-cols-2 gap-x-4 gap-y-2">
        <div className="inline-flex items-center pb-3 border-b gap-x-2 md:col-span-2 border-neutral-300 ">
          <Avatar user={creator} className="w-10 h-10" />
          <div className="flex flex-col">
            <Name user={creator} />
            <p className="text-xs leading-3 text-neutral-500">
              Feedback créé le {formatDate(createdAt)}
            </p>
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="inline-flex items-center justify-between w-full text-lg font-bold gap-x-1">
            <div className="inline-flex items-center gap-x-1">
              Historique
              <Chip extendClassName="ml-1">{history.length}</Chip>
            </div>
          </div>
          {history.length > 0 ? (
            <div className="flex flex-col w-full p-2 mt-1.5 overflow-y-auto border max-h-32 gap-y-1 bg-neutral-50">
              {history.map((h) => (
                <HistoryListItem route={h} key={`${id}-${h}`} />
              ))}
            </div>
          ) : (
            <p className="text-sm">Historique non partagé.</p>
          )}
        </div>

        <div className="pt-2 pb-4 md:col-span-2">
          <p className="text-sm whitespace-pre-line">{text}</p>
        </div>
      </div>
    </Modal>
  );
};
