import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";

import prisma from "@/lib/prisma";
import { AppLayout } from "@/components/Layout";
import { Header } from "@/components/UI/Header";
import { trophies } from "@/resources/trophies-list";
import { ExtendedUser } from "@/types/User";
import { TrophyListItem } from "@/components/Profile/Trophies/TrophyListItem";

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	if (!session?.user?.email)
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};

	const user = await prisma.user.findFirst({
		where: { email: session.user.email },
		include: { trophies: true },
	});
	if (!user)
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};

	return {
		props: { user },
	};
};

type Props = {
	user: ExtendedUser;
};
const ProfileTrophiesPage: NextPage<Props> = ({ user }) => {
	const { trophies: userTrophies } = user;
	return (
		<AppLayout>
			<NextSeo noindex title="Trophées" />
			<section
				className="flex flex-col items-start w-full px-4 mx-auto mt-6 mb-12 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-4"
				aria-label="Profile trophies page"
			>
				<Header text="Trophées" />
				<div className="p-4 bg-neutral-100">
					{Object.values(trophies).map((trophy) => (
						<TrophyListItem
							{...trophy}
							key={trophy.id}
							userTrophy={userTrophies.find(({ key }) => key === trophy.id)}
						/>
					))}
				</div>
			</section>
		</AppLayout>
	);
};

export default ProfileTrophiesPage;
