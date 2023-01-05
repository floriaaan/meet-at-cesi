import { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { getSession, useSession } from "next-auth/react";

import prisma from "@/lib/prisma";
import { AppLayout } from "@/components/Layout";
import { AdminLayout } from "@/components/Layout/Admin/Layout";
import { StatCard } from "@/components/Admin/Card/Stat";
import { ExtendedComment } from "@/types/Event";
import { CommentFeedItem } from "@/components/Event/Comment/FeedItem";
import { ExtendedSession } from "@/types/Session";
import { Header } from "@/components/UI/Header";
import { isAdmin, isModerator } from "@/lib/role";

type Props = {
	count: {
		events: number;
		users: number;
		feedback: number;
		reports: number;
	};

	comments: ExtendedComment[];
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = (await getSession(context)) as ExtendedSession;
	const { user } = session || {};
	if (!user || (!isAdmin(user) && !isModerator(user))) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	const events = await prisma.event.count();
	const users = await prisma.user.count();
	const feedback = await prisma.feedback.count();
	const reports = await prisma.report.count();

	const comments = await prisma.comment.findMany({
		orderBy: { createdAt: "desc" },
		take: 3,
		include: { author: true, event: true },
		where: {
			OR: [{ deletedAt: null }, { deletedAt: { not: null } }],
		},
	});

	return {
		props: {
			count: { events, users, feedback, reports },
			comments,
		},
	};
};

const AdminIndexPage: NextPage<Props> = ({
	count: { events, users, feedback, reports },
	comments,
}) => {
	const { data: session } = useSession();
	const { user } = (session as ExtendedSession) || {};
	return (
		<AppLayout>
			<AdminLayout>
				<NextSeo title="Administration" />
				<section className="grid w-full h-auto grid-cols-2 gap-4 px-4 mx-auto mt-6 lg:grid-cols-4 md:px-12 lg:px-0 lg:max-w-2xl xl:max-w-5xl">
					<Header
						text="Tableau de bord"
						containerClassName="bg-black dark:bg-neutral-900 text-white col-span-2 md:col-span-4"
						className="before:bg-primary"
					/>

					<StatCard
						title="Utilisateurs"
						value={users}
						// colorClassName="bg-purple text-white"
						href={isAdmin(user) ? "/admin/user" : undefined}
					/>
					<StatCard
						title="Événements"
						value={events}
						// colorClassName="bg-primary text-black dark:text-white"
						href={isAdmin(user) ? "/admin/event" : undefined}
					/>

					<StatCard
						title="Feedback"
						value={feedback}
						// colorClassName="bg-green text-white"
						href={isAdmin(user) ? "/admin/feedback" : undefined}
					/>
					<StatCard
						title="Signalements"
						value={reports}
						// colorClassName="bg-pink text-white"
						href={isAdmin(user) ? "/admin/report" : undefined}
					/>
					<div className="flex flex-col w-full col-span-2 p-3 border-dashed gap-y-2 md:col-span-4">
						<h2 className="mb-3 text-xl font-bold">Derniers commentaires</h2>
						{comments.map((comment) => (
							<CommentFeedItem key={comment.id} {...comment} />
						))}
					</div>
				</section>
			</AdminLayout>
		</AppLayout>
	);
};

export default AdminIndexPage;
