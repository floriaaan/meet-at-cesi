import { MdFeedback } from "react-icons/md";
import classNames from "classnames";

import { useFeedback } from "@/components/Helpers/Feedback";

export const FeedbackButton = () => {
  const { isFeedbackOpen, setIsFeedbackOpen } = useFeedback();
  return (
    <button
      aria-label="Feedback open modal button"
      onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
      className={classNames(
        "flex items-center justify-center w-12 h-12  p-2 group",
        isFeedbackOpen
          ? "bg-primary text-black"
          : "text-white bg-black active:bg-primary active:text-black hover:text-primary"
      )}
    >
      <span
        className={classNames(
          "p-2 border-dashed ",
          isFeedbackOpen ? "border border-black" : "group-hover:border border-primary"
        )}
      >
        <MdFeedback className="w-6 h-6 " />
      </span>
      <span className="sr-only">Envoyer un feedback</span>
    </button>
  );
};
