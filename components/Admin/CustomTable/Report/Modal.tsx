import {
	Comment,
	Event,
	ReportObject,
	ReportStatus,
	User,
} from "@prisma/client";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { MdAccountCircle, MdOutlinedFlag } from "react-icons/md";

import toastStyle from "@/resources/toast.config";
import { Avatar, AvatarWithName, Name } from "@/components/UI/Avatar";
import { Modal } from "@/components/UI/Modal";
import { formatDate } from "@/lib/date";
import { acceptReport, pendReport, rejectReport } from "@/lib/fetchers/report";
import { reportReasonList } from "@/resources/report-list";
import { ExtendedReport } from "@/types/Report";

type ReportTableModalProps = ExtendedReport & {
	isModalOpen: boolean;
	closeModal: () => void;
	// eslint-disable-next-line no-unused-vars
	setStatus: (status: ReportStatus) => void;
};

export const ReportTableModal = ({
	isModalOpen,
	closeModal,
	setStatus,
	...report
}: ReportTableModalProps) => {
	const {
		sender,
		related,
		blamedUser,
		type,
		createdAt,
		object,
		content,
		status,
	} = report;

	const handleAction = async (status: ReportStatus) => {
		let result: boolean;
		const toastId: string = toast.loading("Modification en cours...", toastStyle);

		try {
			switch (status) {
				case ReportStatus.ACCEPTED:
					result = await acceptReport(report.id);
					if (result) setStatus(ReportStatus.ACCEPTED);
					break;
				case ReportStatus.PENDING:
					result = await pendReport(report.id);
					if (result) setStatus(ReportStatus.PENDING);
					break;
				case ReportStatus.REFUSED:
					result = await rejectReport(report.id);
					if (result) setStatus(ReportStatus.REFUSED);
					break;
			}
			toast.success("Modification effectuée 🥸", { id: toastId });
			closeModal();
		} catch (e) {
			toast.error("Erreur lors de la modification 😖", { id: toastId });
		}
	};

	return (
		<Modal
			isOpen={isModalOpen}
			onClose={closeModal}
			title={`Signalement de ${sender.name} pour ${blamedUser.name}`}
			maxWidth="md:max-w-3xl"
			overflow="overflow-y-auto"
		>
			<div className="grid md:grid-cols-2 gap-x-4 gap-y-2">
				<div className="inline-flex items-center pb-3 border-b gap-x-2 md:col-span-2 border-neutral-300 dark:border-neutral-700 ">
					<Avatar user={sender} className="w-10 h-10" />
					<div className="flex flex-col">
						<Name user={sender} />
						<p className="text-xs leading-3 text-neutral-50 dark:text-neutral-950">
							Signalement créé le {formatDate(createdAt)}
						</p>
					</div>
				</div>

				<div className="">
					<p className="inline-flex items-center text-lg font-bold gap-x-1">
						<MdAccountCircle />
						Utilisateur signalé
					</p>
					<AvatarWithName
						user={blamedUser}
						direction="row"
						avatarClassName="w-8 h-8"
					/>
				</div>
				<div className="flex flex-col">
					<p className="inline-flex items-center text-lg font-bold gap-x-1">
						<MdOutlinedFlag />
						Objet signalé
					</p>
					<Link
						href={`/${
							object === ReportObject.EVENT || object === ReportObject.COMMENT
								? "event"
								: "user"
						}/${
							object === ReportObject.COMMENT
								? `${(related as Comment).eventId}#${related.id}`
								: related.id
						}`}
						className="text-sm text-neutral-700 dark:text-neutral-300  hover:underline decoration-dashed"
					>
						{object === ReportObject.EVENT ? (related as Event).title : null}
						{object === ReportObject.COMMENT
							? (related as Comment).content
							: null}
						{object === ReportObject.USER ? (related as User).name : null}
					</Link>
				</div>
				<div className="md:col-span-2">
					<p className="inline-flex items-center text-lg font-bold gap-x-1">
						Type de signalement
					</p>
					<p className="text-sm text-neutral-700 dark:text-neutral-300 ">
						{reportReasonList.find((r) => r.value === type)?.label}
					</p>
				</div>
				<div className="md:col-span-2">
					<p className="inline-flex items-center text-lg font-bold gap-x-1">
						Contenu
					</p>
					<p className="text-xs text-neutral-700 dark:text-neutral-300 ">{content}</p>
				</div>
				<div className="inline-flex items-center gap-2 pt-2 border-t md:col-span-2 border-neutral-300 dark:border-neutral-700">
					<button
						disabled={status === ReportStatus.PENDING}
						className="border-0 btn-black"
						onClick={() => handleAction(ReportStatus.PENDING)}
					>
						Mettre en attente
					</button>
					<button
						disabled={status === ReportStatus.ACCEPTED}
						className="border-0 btn-black"
						onClick={() => handleAction(ReportStatus.ACCEPTED)}
					>
						Accepter (désactiver)
					</button>
					<button
						disabled={status === ReportStatus.REFUSED}
						className="border-0 btn-black"
						onClick={() => handleAction(ReportStatus.REFUSED)}
					>
						Refuser
					</button>
				</div>
			</div>
		</Modal>
	);
};
