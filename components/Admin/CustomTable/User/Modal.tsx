import { Avatar, Name } from "@/components/UI/Avatar";
import { Modal } from "@/components/UI/Modal";
import { formatDate } from "@/lib/date";
import { ExtendedUser } from "@/types/User";
import {
	RoleForm,
	RoleFormValues,
} from "@/components/Admin/CustomTable/User/RoleForm";
import { changeRole, ChangeRoleRequestInput } from "@/lib/fetchers/user";
import { Role } from "@prisma/client";

type UserTableModalProps = ExtendedUser & {
	isModalOpen: boolean;
	closeModal: () => void;
	// eslint-disable-next-line no-unused-vars
	setRole: (role: Role) => void;
};

export const UserTableModal = ({
	isModalOpen,
	closeModal,
	setRole,
	...user
}: UserTableModalProps) => {
	const { name, createdAt, role } = user;

	async function handleSubmit(values: RoleFormValues) {
		return changeRole({
			...values,
			userId: user.id,
		} as ChangeRoleRequestInput).then((r) => {
			if (!(r instanceof Error) && r.user.role) {
				setRole(r.user.role);
			}
			return Promise.resolve(r);
		});
	}
	return (
		<Modal
			isOpen={isModalOpen}
			onClose={closeModal}
			title={`${name}`}
			maxWidth="md:max-w-lg"
			overflow="overflow-y-auto"
		>
			<div className="grid md:grid-cols-2 gap-x-4 gap-y-2">
				<div className="inline-flex items-center pb-3 border-b gap-x-2 md:col-span-2 border-neutral-300 ">
					<Avatar user={user} className="w-10 h-10" />
					<div className="flex flex-col">
						<Name user={user} />
						<p className="text-xs leading-3 text-neutral-500">
							Utilisateur inscrit le {formatDate(createdAt)}
						</p>
					</div>
				</div>

				<div className="md:col-span-2">
					<RoleForm
						closeModal={closeModal}
						initialValues={{ role } as RoleFormValues}
						onSubmit={handleSubmit}
					/>
				</div>
			</div>
		</Modal>
	);
};
