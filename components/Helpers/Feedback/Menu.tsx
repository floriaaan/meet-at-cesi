import { useFeedback } from "@/components/Helpers/Feedback";

export const FeedbackMenu = () => {
  const { history, isFeedbackOpen, setIsFeedbackOpen } = useFeedback();

  console.log(history);
  return <></>;
};
