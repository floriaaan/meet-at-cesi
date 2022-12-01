import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

import { FeedbackButton } from "@/components/Helpers/Feedback/Button";
import { FeedbackModal } from "@/components/Helpers/Feedback/Modal";

type FeedbackContextType = {
  isFeedbackOpen: boolean;
  setIsFeedbackOpen: (value: boolean) => void;
  history: string[];
};
const FeedbackContext = createContext({});
export const useFeedback = () =>
  useContext(FeedbackContext) as FeedbackContextType;

export const FeedbackWrapper = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setHistory((prev) => [...prev, router.pathname]);
  }, [router.pathname]);

  return (
    <FeedbackContext.Provider
      value={{ history, isFeedbackOpen, setIsFeedbackOpen }}
    >
      <div className="fixed flex flex-col-reverse bottom-4 right-4">
        <FeedbackButton />
        <FeedbackModal />
      </div>
    </FeedbackContext.Provider>
  );
};
