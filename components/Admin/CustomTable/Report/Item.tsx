import { useState } from "react";
import { useRouter } from "next/router";

import { AvatarWithName } from "@/components/UI/Avatar/WithName";
import { ExtendedReport } from "@/types/Report";
import { ReportTableModal } from "@/components/Admin/CustomTable/Report/Modal";
import { formatDate } from "@/lib/date";
import {
	reportObjectList,
	reportReasonList,
	reportStatusList,
} from "@/resources/report-list";
import {
	Comment,
	Event,
	ReportObject,
	ReportStatus,
	User,
} from "@prisma/client";
import classNames from "classnames";

export const ReportTableItem = (props: ExtendedReport) => {
	const router = useRouter();
	const { id } = router.query;
	const [isModalOpen, setIsModalOpen] = useState(id === props.id);
	const openModal = () => {
		setIsModalOpen(true);
		router.push(`/admin/report?id=${props.id}`, undefined, { shallow: true });
	};
	function closeModal() {
		setIsModalOpen(false);
		router.push(`/admin/report`, undefined, { shallow: true });
	}

	const {
		sender,
		related,
		blamedUser,
		type,
		createdAt,
		object,
		status: initialStatus,
	} = props;

	const [status, setStatus] = useState(initialStatus);

	return (
		<>
			<tr
				className={classNames(
					"w-full text-black dark:text-white bg-white dark:bg-black cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900",
					{ "opacity-50": status !== ReportStatus.PENDING },
				)}
				onClick={openModal}
			>
				<td className="px-6 py-4">
					<AvatarWithName
						user={sender}
						avatarClassName="w-6 h-6 text-xs"
						textClassName="text-[0.75rem] font-bold"
						direction="row"
					/>
				</td>
				<td className="px-3 text-xs">
					{reportObjectList.find((r) => r.value === object)?.label}
				</td>
				<td className="max-w-[12rem] xl:max-w-sm px-3 text-xs truncate">
					{object === ReportObject.EVENT ? (related as Event).title : null}
					{object === ReportObject.COMMENT
						? (related as Comment).content
						: null}
					{object === ReportObject.USER ? (related as User).name : null}
				</td>
				<td className="px-6 py-4">
					<AvatarWithName
						user={blamedUser}
						avatarClassName="w-6 h-6 text-xs"
						textClassName="text-[0.75rem] font-bold"
						direction="row"
					/>
				</td>
				<td className="px-3 text-sm">
					{reportReasonList.find((r) => r.value === type)?.label}
				</td>
				<td className="px-3 text-sm">
					{formatDate(createdAt, {
						day: "numeric",
						month: "short",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
					})}
				</td>
				<td className="px-3 pr-6 text-sm">
					{reportStatusList.find((r) => r.value === status)?.label}
				</td>
			</tr>
			<ReportTableModal
				{...props}
				isModalOpen={isModalOpen}
				closeModal={closeModal}
				setStatus={setStatus}
			/>
		</>
	);
};
