import { Avatar, Name } from "@/components/UI/Avatar";
import { Modal } from "@/components/UI/Modal";
import { formatDate } from "@/lib/date";
import { ExtendedFeedback } from "@/types/Feedback";

type FeedbackTableModalProps = ExtendedFeedback & {
  isModalOpen: boolean;
  closeModal: () => void;
};

export const FeedbackTableModal = ({
  isModalOpen,
  closeModal,
  ...feedback
}: FeedbackTableModalProps) => {
  const { user: creator, createdAt, text } = feedback;

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
        <div className="pt-2 pb-4 md:col-span-2">
          <p className="text-sm whitespace-pre-line">{text}</p>
        </div>
      </div>
    </Modal>
  );
};
