import { Dialog, Transition } from "@headlessui/react";
import { User } from "@prisma/client";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import classNames from "classnames";
import toast from "react-hot-toast";

import { createInvitation, searchUsers } from "@/lib/fetchers";
import { UserListItem } from "@/components/User/ListItem";
import toastStyle from "@/resources/toast.config";
import { getPlural } from "@/lib/string";
import { Spinner } from "@/components/UI/Fallback/Spinner";
import { ExtendedInvitation } from "@/types/Event";
import { Input } from "@/components/UI/Form";
import { useInvitations } from "@/components/Invitation/Provider";

type Props = {
	closeModal: () => void;
	participants: User[];
	eventId: string;
	invitations: Omit<ExtendedInvitation, "sender" | "event">[];
};

export const InvitationModal = ({
	closeModal,
	participants,
	eventId,
	invitations,
}: Props) => {
	const [name, setName] = useState("");
	const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { setInvitations } = useInvitations();

	const invitationsReceivers = invitations.map(
		(invitation) => invitation.receiver,
	);

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		if (name.trim().length > 0) {
			setIsSearching(true);
			timeout = setTimeout(async () => {
				const results = await searchUsers({
					name: name.toLocaleLowerCase(),
					offset: -1,
				});
				setSearchResults(results);
				setIsSearching(false);
			}, 500);
		}

		return () => clearTimeout(timeout);
	}, [name]);

	const handleSubmit = async () => {
		if (selectedUsers.length > 0) {
			setIsSubmitting(true);
			const toastId = toast.loading(
				`${getPlural(
					selectedUsers.length,
					"Invitation",
					"Invitations",
				)} en cours d'envoi...`,
				toastStyle,
			);
			const result = await createInvitation(
				eventId,
				selectedUsers.map((user) => user.id),
			);
			if (result) {
				toast.success(
					`${getPlural(
						selectedUsers.length,
						"Invitation",
						"Invitations",
					)} ${getPlural(selectedUsers.length, "partie", "parties")} 🥳`,
					{ id: toastId },
				);
				setInvitations(result);
				setIsSubmitting(false);
				closeModal();
				return;
			} else toast.error("Une erreur est survenue 😣", { id: toastId });
			setIsSubmitting(false);
		} else toast.error("Aucun utilisateur sélectionné 🤦", toastStyle);
	};

	const filteredSearchResults = searchResults
		.filter((u) => !selectedUsers.some((s) => s.id === u.id))
		.filter((u) => !participants.some((p) => p.id === u.id))
		.filter((u) => !invitationsReceivers.some((r) => r.id === u.id));

	return (
		<Transition appear show as={Fragment}>
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
										Invitations
									</Dialog.Title>
									<button onClick={closeModal}>
										<MdClose className="w-6 h-6" />
									</button>
								</div>
								<p className="text-xs">{"Bon, j'invite qui ?"}</p>
								<div className="flex flex-col w-full mt-4">
									<Input
										type="text"
										uncontrolled
										label="Rechercher un utilisateur"
										name="name"
										value={name}
										onChange={(e: ChangeEvent<HTMLInputElement>) =>
											setName(e.target.value)
										}
									/>
									<div className="flex flex-col w-full h-64 p-1 overflow-y-auto bg-gray-100 max-h-64 gap-y-1">
										{[
											...participants,
											...invitationsReceivers,
											...selectedUsers,
										].map((user) => (
											<UserListItem
												key={user.id}
												user={user}
												className={classNames(
													"px-2 py-1 cursor-pointer hover:bg-gray-50",
													participants.some((p) => p.id === user.id) ||
														(invitationsReceivers.some(
															(r) => r.id === user.id,
														) &&
															"opacity-50 cursor-not-allowed"),
												)}
												checked
												onCheck={() => {
													setSelectedUsers(
														selectedUsers.filter(
															(selectedUser) => selectedUser.id !== user.id,
														),
													);
												}}
												optionalNode={
													participants.some((p) => p.id === user.id) ? (
														<span className="text-xs">déjà participant</span>
													) : invitationsReceivers.some(
															(r) => r.id === user.id,
													  ) ? (
														<span className="text-xs">déjà invité</span>
													) : undefined
												}
											/>
										))}

										{isSearching ? (
											<p className="flex items-center justify-center w-full p-6 text-xs">
												{"Recherche en cours..."}
											</p>
										) : (
											<>
												{filteredSearchResults.length > 0 ? (
													filteredSearchResults.map((user) => (
														<UserListItem
															key={user.id}
															user={user}
															className="px-2 py-1 cursor-pointer hover:bg-gray-50"
															checked={false}
															onCheck={(user) => {
																setSelectedUsers([...selectedUsers, user]);
															}}
														/>
													))
												) : (
													<p className="flex items-center justify-center p-6 text-xs">
														{"Aucun résultat"}
													</p>
												)}
											</>
										)}
									</div>
								</div>

								<div className="mt-4">
									<button
										type="button"
										className="border-b btn-black"
										onClick={handleSubmit}
									>
										{isSubmitting ? (
											<Spinner
											// className="w-5 h-5"
											/>
										) : (
											"Envoyer"
										)}
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
