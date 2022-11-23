import { MdFeedback } from "react-icons/md";
import { useFeedback } from "@/components/Helpers/Feedback";

export const FeedbackButton = () => {
  const { isFeedbackOpen, setIsFeedbackOpen } = useFeedback();
  return (
    <button
      onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
      className="flex items-center justify-center w-12 h-12 bg-black"
    >
      <MdFeedback className="w-6 h-6 text-white" />
    </button>
  );
};
