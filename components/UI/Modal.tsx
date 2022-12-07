import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";
import { Fragment } from "react";
import { MdClose } from "react-icons/md";

type ModalProps = {
  title: string | JSX.Element;
  subtitle?: string | JSX.Element;
  children: JSX.Element;
  isOpen: boolean;
  onClose: () => void;

  maxWidth?: string;
  overflow?: string;
};

/**
 * Returns a generic modal with a form.
 * Behaves like a modal on desktop view, and like a bottom sheet in mobile.
 *
 * See `./components/Helpers/Feedback/Modal.tsx` for an example.
 * See `./components/Report/Modal.tsx` for an example.
 *
 * TODO: need to fix overflow issues on mobile
 */
export const Modal = ({
  title,
  subtitle,
  children,
  isOpen,
  onClose,
  maxWidth = "xs:max-w-md",
  overflow = "overflow-hidden",
}: ModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[51]" />
        </Transition.Child>

        <div className="fixed bottom-0 left-0 w-full overflow-y-auto sm:inset-0 z-[52]">
          <div className="flex items-center justify-center w-full min-h-full overflow-y-auto text-center sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={classNames(
                  "w-full p-4  text-left text-black align-middle transition-all transform bg-white border-black shadow-xl sm:border",
                  maxWidth,
                  overflow
                )}
              >
                <div className="inline-flex justify-between w-full">
                  <Dialog.Title as="h3" className="text-xl font-bold truncate">
                    {title}
                  </Dialog.Title>

                  <button onClick={onClose}>
                    <MdClose className="w-6 h-6" />
                  </button>
                </div>
                {subtitle ? subtitle : null}
                <div className="w-full mt-2 overflow-y-auto">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
