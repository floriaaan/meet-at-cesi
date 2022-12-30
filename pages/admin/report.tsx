import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";

import prisma from "@/lib/prisma";
import CustomTable from "@/components/Admin/CustomTable";
import { AppLayout } from "@/components/Layout";
import { AdminLayout } from "@/components/Layout/Admin/Layout";
import { ExtendedSession } from "@/types/Session";
import { isAdmin } from "@/lib/role";
import { ExtendedReport } from "@/types/Report";
import { ReportTableItem } from "@/components/Admin/CustomTable/Report/Item";
import { ReportObject, ReportStatus } from "@prisma/client";

type Props = {
	reports: ExtendedReport[];
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

	let reports = await prisma.report.findMany({
		orderBy: { createdAt: "asc" },
		include: { blamedUser: true, sender: true },
	});

	const events = await prisma.event.findMany({
		where: {
			id: {
				in: reports
					.filter((r) => r.objectId !== null)
					.filter((r) => r.object === ReportObject.EVENT)
					.map((r) => r.objectId) as string[],
			},
			OR: [{ deletedAt: null }, { deletedAt: { not: null } }],
		},
	});
	const comments = await prisma.comment.findMany({
		where: {
			id: {
				in: reports
					.filter((r) => r.objectId !== null)
					.filter((r) => r.object === ReportObject.COMMENT)
					.map((r) => r.objectId) as string[],
			},
			OR: [{ deletedAt: null }, { deletedAt: { not: null } }],
		},
	});
	const users = await prisma.user.findMany({
		where: {
			id: {
				in: reports
					.filter((r) => r.objectId !== null)
					.filter((r) => r.object === ReportObject.USER)
					.map((r) => r.objectId) as string[],
			},
			OR: [{ deletedAt: null }, { deletedAt: { not: null } }],
		},
	});

	reports = reports
		.map((report) => {
			if (report.object === ReportObject.EVENT) {
				const event = events.find((e) => e.id === report.objectId);
				return { ...report, related: event };
			}
			if (report.object === ReportObject.COMMENT) {
				const comment = comments.find((c) => c.id === report.objectId);
				return { ...report, related: comment };
			}
			if (report.object === ReportObject.USER) {
				const user = users.find((u) => u.id === report.objectId);
				return { ...report, related: user };
			}
			return report;
		})
		.sort((a, b) => {
			const isAPending = a.status === ReportStatus.PENDING;
			const isBPending = b.status === ReportStatus.PENDING;
			if (isAPending && !isBPending) return -1;
			if (!isAPending && isBPending) return 1;
			return 0;
		});

	return {
		props: { reports },
	};
};

const AdminReportPage: NextPage<Props> = ({ reports }) => {
	return (
		<AppLayout>
			<AdminLayout>
				<NextSeo title="Reports, admin." />
				<div className="lg:p-4">
					<CustomTable
						title="Reports"
						items={reports}
						columns={[
							"Utilisateur émetteur",
							"Type de contenu signalé",
							"Contenu",
							"Utilisateur signalé",
							"Type",
							"Créé le",
							{
								label: "Statut",
								props: {
									"aria-sort": "ascending",
									className:
										"aria-[sort=ascending]:bg-[url('/img/sort-arrow.svg')]",
								},
							},
						]}
						renderItem={renderReport as (item: unknown) => JSX.Element}
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

export default AdminReportPage;

function renderReport(report: ExtendedReport) {
	return <ReportTableItem {...report} key={report.id} />;
}
