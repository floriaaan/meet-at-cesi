import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";

import prisma from "@/lib/prisma";
import CustomTable from "@/components/Admin/CustomTable";
import { AppLayout } from "@/components/Layout";
import { AdminLayout } from "@/components/Layout/Admin/Layout";
import { ExtendedSession } from "@/types/Session";
import { isAdmin } from "@/lib/role";
import { ExtendedFeedback } from "@/types/Feedback";
import { FeedbackTableItem } from "@/components/Admin/CustomTable/Feedback/Item";

type Props = {
	feedbacks: ExtendedFeedback[];
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

	const feedbacks = await prisma.feedback.findMany({
		orderBy: { createdAt: "asc" },
		include: {
			user: true,
		},
	});


	return {
		props: { feedbacks },
	};
};

const AdminFeedbackPage: NextPage<Props> = ({ feedbacks }) => {
	return (
		<AppLayout>
			<AdminLayout>
				<NextSeo title="Feedbacks, admin." />
				<div className="lg:p-4">
					<CustomTable
						title="Feedbacks"
						items={feedbacks}
						columns={[
							"Contenu",
							"Créateur",
							"Page",
							"Historique partagé",
							"Créé le",
						]}
						renderItem={renderFeedback}
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

export default AdminFeedbackPage;

function renderFeedback(feedback: ExtendedFeedback) {
	return <FeedbackTableItem {...feedback} key={feedback.id} />;
}
