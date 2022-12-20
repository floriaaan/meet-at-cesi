import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";

import prisma from "@/lib/prisma";
import CustomTable from "@/components/Admin/CustomTable";
import { AppLayout } from "@/components/Layout";
import { AdminLayout } from "@/components/Layout/Admin/Layout";
import { ExtendedSession } from "@/types/Session";
import { isAdmin } from "@/lib/role";
import { ExtendedUser } from "@/types/User";
import { UserTableItem } from "@/components/Admin/CustomTable/User/Item";

type Props = {
	users: ExtendedUser[];
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = (await getSession(context)) as ExtendedSession;
	if (!session?.user || !isAdmin(session.user)) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	let users = await prisma.user.findMany({
		orderBy: { createdAt: "asc" },
		where: {
			OR: [{ deletedAt: null }, { deletedAt: { not: null } }],
		},
	});

	users = JSON.parse(JSON.stringify(users));

	return {
		props: { users },
	};
};

const AdminEventPage: NextPage<Props> = ({ users }) => {
	return (
		<AppLayout>
			<AdminLayout>
				<NextSeo title="Utilisateurs, admin." />
				<div className="lg:p-4">
					<CustomTable
						title="Utilisateurs"
						items={users}
						columns={["Nom", "Email", "Rôle", "Inscrit le", "Actif"]}
						renderItem={renderUser}
						pagination={{
							initialPage: 0,
							pageSize: 10,
						}}
					/>
				</div>
			</AdminLayout>
		</AppLayout>
	);
};

export default AdminEventPage;

function renderUser(user: ExtendedUser) {
	return <UserTableItem {...user} key={user.id} />;
}
