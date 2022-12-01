import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { MdClose } from "react-icons/md";

import { useReport } from "@/components/Report/Wrapper";
import { ReportForm } from "@/components/Report/Form";
import { createReport } from "@/lib/fetchers";
import { reportObjectList } from "@/resources/report-list";

export const ReportModal = () => {
  const {
    object,
    isReportModalOpen: isOpen,
    setIsReportModalOpen,
  } = useReport();
  const closeModal = () => setIsReportModalOpen(false);

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
                    Signaler {reportObjectList.find(o => o.value === object.object)?.fullLabel}
                  </Dialog.Title>
                  <button onClick={closeModal}>
                    <MdClose className="w-6 h-6" />
                  </button>
                </div>
                <div className="w-full mt-2">
                  <ReportForm
                    submitClassName="w-full btn-black text-sm border-b"
                    labelClassName="text-xs font-bold font-black"
                    onSubmit={createReport}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
