import { useFeedback } from "@/components/Helpers/Feedback";
import { createFeedback } from "@/lib/fetchers";
import { FeedbackForm } from "@/components/Helpers/Feedback/Form";
import { Modal } from "@/components/UI/Modal";

export const FeedbackModal = () => {
  const { isFeedbackOpen, setIsFeedbackOpen, history } = useFeedback();
  const closeModal = () => setIsFeedbackOpen(false);

  return (
    <Modal
      title="Feedback"
      subtitle={
        <>
          <div className="flex flex-col text-xs xs:gap-2 xs:flex-row xs:items-center ">
            <span>{'" C\'est cassé 😣 "'}</span>
            <span className="hidden xs:block">{"—"}</span>
            <span>{'" Il manquerait ça pour que ça soit parfait 🥰 "'}</span>
          </div>
          <p className="mt-1.5 text-sm font-bold">Dîtes nous tout !</p>
        </>
      }
      isOpen={isFeedbackOpen}
      onClose={closeModal}
    >
      <FeedbackForm
        onSubmit={(values) => {
          return createFeedback({
            ...values,
            history: values.history_share ? history : [],
          });
        }}
        submitClassName="w-full btn-black text-sm border-b"
        labelClassName="text-xs font-bold font-black"
      />
    </Modal>
  );
};
