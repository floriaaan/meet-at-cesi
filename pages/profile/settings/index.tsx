import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";

import prisma from "@/lib/prisma";
import { AppLayout } from "@/components/Layout";
import { ProfileLayout } from "@/components/Layout/Profile/Layout";
import { Header } from "@/components/UI/Header";
import { ExtendedUser } from "@/types/User";
import { PreferencesSection } from "@/components/Profile/Preferences/Section";
import { ImageUploadSection } from "@/components/Profile/ImageUpload/Section";
import { EmailVerificationSection } from "@/components/Profile/EmailVerification/Section";
import { PrivacySection } from "@/components/Profile/Privacy/Section";

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getSession(context);
	if (!session || !session.user?.email) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	const user = await prisma.user.findUnique({
		where: { email: session.user?.email },
		include: { preferences: true, privacy: true },
	});

	return {
		props: { user },
	};
}

type Props = {
	user: ExtendedUser;
};

const ProfileSettingsPage: NextPage<Props> = ({ user }) => {
	return (
		<AppLayout>
			<ProfileLayout>
				<NextSeo noindex title="Paramètres" />
				<section className="flex flex-col items-start w-full px-4 mx-auto mt-6 mb-12 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-4">
					<Header text="Paramètres" />
					<div className="flex flex-col w-full divide-y">
						<ImageUploadSection user={user} />
						<PreferencesSection user={user} />
						<PrivacySection user={user} />
						<EmailVerificationSection user={user} />
					</div>
				</section>
			</ProfileLayout>
		</AppLayout>
	);
};

export default ProfileSettingsPage;
