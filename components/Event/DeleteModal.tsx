import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import type { ExtendedEvent } from "@/types/Event";
import { deleteEvent } from "@/lib/fetchers";
import toastProps from "@/resources/toast.config";
import { log } from "@/lib/log";

export const DeleteModal = ({
	event,
	isOpen = false,
	closeModal,
}: {
	event: ExtendedEvent;
	isOpen: boolean;
	closeModal: () => void;
}) => {
	const router = useRouter();
	const handleDelete = async () => {
		try {
			let toastId = toast.loading("Suppression de l'événement...", toastProps);
			const result = await deleteEvent(event.id);
			if (result) {
				toast.success("Événement supprimé 👍", { id: toastId });
				closeModal();
				router.push("/event");
			} else toast.error("Une erreur est survenue... 😣", { id: toastId });
		} catch (e) {
			log.error(e);
			toast.error("Une erreur est survenue... 😣", toastProps);
		}
	};
	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={closeModal}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex items-center justify-center min-h-full p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl ">
								<Dialog.Title
									as="h3"
									className="text-lg font-bold leading-6 text-black"
								>
									{`Supprimer l'événement: ${event.title}`}
								</Dialog.Title>
								<div className="mt-2">
									<p className="text-sm whitespace-pre">
										Êtes-vous sûr de vouloir supprimer cet événement ?
										<br />
										Cette action est irréversible.
									</p>
								</div>

								<div className="inline-flex justify-end w-full mt-4 gap-x-2">
									<button
										className="border btn-red hover:border"
										onClick={handleDelete}
									>
										Confirmer
									</button>
									<button
										type="button"
										className="w-1/5 border btn-black hover:border"
										onClick={closeModal}
									>
										Annuler
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};
