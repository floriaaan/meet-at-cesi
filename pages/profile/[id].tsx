import type { GetServerSideProps, NextPage } from "next";
import { NextSeo } from "next-seo";
import { getSession } from "next-auth/react";

import type { ExtendedUser } from "@/types/User";
import prisma from "@/lib/prisma";
import { InvitationsProvider } from "@/hooks/useInvitations";
import { AppLayout } from "@/components/Layout";
import { ProfileLayout } from "@/components/Layout/Profile/Layout";
import { ReceivedInvitationSection } from "@/components/Profile/Invitation/ReceivedSection";
import { SendedInvitationSection } from "@/components/Profile/Invitation/SendedSection";
import { ParticipatingSection } from "@/components/Profile/Event/ParticipatingSection";
import { CreatedSection } from "@/components/Profile/Event/CreatedSection";
import { ProfileCard } from "@/components/Profile/Card";
import { PreferencePrivacy, UserPrivacy } from "@prisma/client";
import { TrophiesSection } from "@/components/Profile/Trophies/Section";

const INVITATIONS_PRISMA_INCLUDE = {
  include: {
    event: { include: { creator: true } },
    receiver: true,
    sender: true,
  },
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session?.user?.email)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  const { id } = context.params as { id: string };

  const today = new Date(new Date().setDate(new Date().getDate() - 1));
  let user = await prisma.user.findFirst({
    where: { id },
    include: {
      privacy: true,
      preferences: { select: { privacy: true } },
      participations: {
        where: {
          date: { gte: today },
        },
        include: { creator: true, participants: true },
      },
      createdEvents: {
        where: {
          date: { gte: today },
        },
        include: { creator: true, participants: true },
      },
    },
  });
  user = JSON.parse(JSON.stringify(user));
  if (!user)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  if (user.email === session.user.email) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }
  const preferences = await prisma.preference.findFirst({
    where: { userId: user.id },
    select: {
      campus:
        user.preferences?.privacy === PreferencePrivacy.PUBLIC ||
        user.preferences?.privacy === PreferencePrivacy.CAMPUS_ONLY,
      promotion:
        user.preferences?.privacy === PreferencePrivacy.PUBLIC ||
        user.preferences?.privacy === PreferencePrivacy.PROMOTION_ONLY,
    },
  });

  user.preferences = {
    campus: undefined,
    promotion: undefined,
    privacy: user.preferences?.privacy || PreferencePrivacy.PUBLIC,
    ...preferences,
  };

  return {
    props: { user },
  };
};

type Props = {
  user: ExtendedUser;
};
const ProfileIndexPage: NextPage<Props> = ({ user }) => {
  const { participations, createdEvents, privacy } = user;

  return (
    <AppLayout>
      <ProfileLayout noSidebar>
        <NextSeo noindex title={user.name || "Profil"} />
        <section
          className="flex flex-col items-start w-full px-4 mx-auto mt-6 mb-12 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-4"
          aria-label="Profile index page"
        >
          <ProfileCard user={user} />
          <div className="w-full h-auto">
            {privacy?.trophies ? <TrophiesSection user={user} /> : null}
            <section id="events" className="flex flex-col w-full">
              {privacy?.participations === UserPrivacy.PUBLIC ? (
                <ParticipatingSection events={participations || []} />
              ) : null}
              {privacy?.createdEvents === UserPrivacy.PUBLIC ? (
                <CreatedSection events={createdEvents || []} />
              ) : null}
            </section>
          </div>
        </section>
      </ProfileLayout>
    </AppLayout>
  );
};

export default ProfileIndexPage;
