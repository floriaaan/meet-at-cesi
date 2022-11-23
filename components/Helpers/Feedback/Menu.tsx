import { useFeedback } from "@/components/Helpers/Feedback";
import { createFeedback } from "@/lib/fetchers";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MdClose } from "react-icons/md";
import { FeedbackForm } from "./Form";

export const FeedbackMenu = () => {
  const { isFeedbackOpen, setIsFeedbackOpen, history } = useFeedback();
  const closeModal = () => setIsFeedbackOpen(false);

  return (
    <Transition appear show={isFeedbackOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed bottom-0 left-0 w-full overflow-y-auto xs:inset-0">
          <div className="flex items-center justify-center w-full min-h-full text-center xs:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full p-4 overflow-hidden text-left align-middle transition-all transform bg-white border-black shadow-xl xs:border xs:max-w-md">
                <div className="inline-flex justify-between w-full">
                  <Dialog.Title as="h3" className="text-xl font-bold">
                    Feedback
                  </Dialog.Title>
                  <button onClick={closeModal}>
                    <MdClose className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-col text-xs xs:gap-2 xs:flex-row xs:items-center ">
                  <span>{'" C\'est cassé 😣 "'}</span>
                  <span className="hidden xs:block">{"—"}</span>
                  <span>
                    {'" Il manquerait ça pour que ça soit parfait 🥰 "'}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-bold">Dîtes nous tout !</p>
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
