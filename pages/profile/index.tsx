import type { GetServerSideProps, NextPage } from "next";

import type { ExtendedUser } from "@/types/User";
import prisma from "@/lib/prisma";
import audienceList from "@/resources/audience-list";
import campusList from "@/resources/campus-list";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProfileLayout } from "@/components/Layout/Profile/ProfileLayout";
import { getSession } from "next-auth/react";
import { HeroTitle } from "@/components/UI/HeroTitle";
import { Avatar } from "@/components/UI/Avatar";
import { ReceivedInvitationSection } from "@/components/Invitation/ReceivedSection";
import { SendedInvitationSection } from "@/components/Invitation/SendedSection";
import { formatRelative } from "@/lib/date";
import { InvitationsProvider } from "@/hooks/useInvitations";
import { NextSeo } from "next-seo";

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

  let user = await prisma.user.findFirst({
    where: { email: session.user.email },
    include: {
      preferences: true,
      receivedInvitations: {
        ...INVITATIONS_PRISMA_INCLUDE,
        where: { status: "PENDING" },
      },
      sendedInvitations: INVITATIONS_PRISMA_INCLUDE,
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

  return {
    props: { user },
  };
};

type Props = {
  user: ExtendedUser;
};
const ProfileIndexPage: NextPage<Props> = ({ user }) => {
  const { receivedInvitations, sendedInvitations } = user;
  return (
    <AppLayout>
      <ProfileLayout>
        <NextSeo noindex title={user.name || "Mon profil"} />
        <section
          className="flex flex-col items-start w-full px-4 mx-auto mt-6 mb-12 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-4"
          aria-label="Profile index page"
        >
          <ProfileCard user={user} />
          <InvitationsProvider
            initialReceivedInvitations={receivedInvitations}
            initialSendedInvitations={sendedInvitations}
          >
            <section id="invitations" className="flex flex-col w-full">
              <ReceivedInvitationSection />
              <SendedInvitationSection />
            </section>
          </InvitationsProvider>
          {/* <pre className="text-xs">{JSON.stringify(user, undefined, 2)}</pre> */}
        </section>
      </ProfileLayout>
    </AppLayout>
  );
};

export default ProfileIndexPage;

const getCampusLabel = (campus: string | undefined) =>
  campusList.find((c) => c.value === campus)?.label || "Campus inconnu";

const getPromotionLabel = (promotion: string | undefined) => {
  if (!promotion) return "Promotion inconnue";
  const [audience, year] = promotion.split(":");
  const audienceLabel = audienceList.find(
    (a) => a.value === audience
  )?.shortLabel;
  return `${audienceLabel} ${year}`;
};

const ProfileCard = ({ user }: { user: ExtendedUser }) => {
  return (
    <div className="relative inline-flex w-full bg-primary">
      <span className="z-10 flex items-center h-full pl-4 shrink-0 bg-primary w-fit">
        <Avatar
          user={user}
          className="w-16 h-16 text-xl bg-black lg:w-32 lg:h-32 text-primary"
        />
      </span>

      <span className="relative flex flex-col -left-2 ">
        <HeroTitle
          text={(user.name as string).toLowerCase()}
          className="capitalize text-[32px] sm:text-[3.5rem]  md:text-[4rem]"
        />

        <div className="relative z-10 flex flex-col -mb-2 left-6 -top-6 md:-top-10">
          <div className="flex flex-col truncate md:gap-1 md:flex-row">
            <strong className="text-sm uppercase truncate md:text-base">
              {getCampusLabel(user.preferences?.campus)}
            </strong>
            <span className="hidden md:block">-</span>
            <strong className="text-sm uppercase truncate md:text-base">
              {getPromotionLabel(user.preferences?.promotion)}
            </strong>
          </div>
          <span className="text-xs md:text-sm">
            {`inscrit il y a ${formatRelative(user.createdAt.toString())}`}
          </span>
        </div>
      </span>
    </div>
  );
};
