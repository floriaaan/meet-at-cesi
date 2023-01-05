import { useState } from "react";
import { useRouter } from "next/router";

import { AvatarWithName } from "@/components/UI/Avatar/WithName";
import { ExtendedUser } from "@/types/User";
import { UserTableModal } from "@/components/Admin/CustomTable/User/Modal";
import { formatDate } from "@/lib/date";
import { Chip } from "@/components/UI/Chip";
import { roleList } from "@/resources/role-list";

export const UserTableItem = (props: ExtendedUser) => {
	const router = useRouter();
	const { id } = router.query;
	const [isModalOpen, setIsModalOpen] = useState(id === props.id);
	const openModal = () => {
		setIsModalOpen(true);
		router.push(`/admin/user?id=${props.id}`, undefined, { shallow: true });
	};
	function closeModal() {
		setIsModalOpen(false);
		router.push(`/admin/user`, undefined, { shallow: true });
	}

	const { createdAt, role: initialRole, email, deletedAt } = props;

	const [role, setRole] = useState(initialRole);
	return (
		<>
			<tr
				className="w-full text-black bg-white cursor-pointer dark:text-white dark:bg-black hover:bg-neutral-100 dark:hover:bg-neutral-900"
				onClick={openModal}
			>
				<td className="px-6 py-4">
					<AvatarWithName
						user={props}
						avatarClassName="w-6 h-6 text-xs"
						textClassName="text-[0.75rem] font-bold"
						direction="row"
					/>
				</td>
				<td className="px-3 text-xs">{email}</td>
				<td className="px-3">
					<Chip>{roleList.find((r) => r.value === role)?.label}</Chip>
				</td>
				<td className="pl-3 pr-6 text-sm">
					{formatDate(createdAt, {
						day: "numeric",
						month: "short",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
					})}
				</td>
				<td className="pl-3 pr-6 text-sm">
					{deletedAt === null ? (
						<span className="inline-flex items-center gap-x-1">
							✅<span className="sr-only">actif</span>
						</span>
					) : (
						<span>
							❌<span className="sr-only">désactivé</span>
						</span>
					)}
				</td>
			</tr>
			<UserTableModal
				{...props}
				role={role}
				isModalOpen={isModalOpen}
				closeModal={closeModal}
				setRole={setRole}
			/>
		</>
	);
};
