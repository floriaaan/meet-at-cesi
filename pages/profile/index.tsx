import type { GetServerSideProps, NextPage } from "next";

import type { ExtendedUser } from "@/types/User";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProfileLayout } from "@/components/Layout/Profile/ProfileLayout";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";
import { HeroTitle } from "@/components/UI/HeroTitle";
import { Avatar } from "@/components/UI/Avatar";
import audienceList from "@/resources/audience-list";
import campusList from "@/resources/campus-list";

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
    include: { preferences: true },
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
const ProfileIndexPage: NextPage<Props> = ({ user }) => {
  return (
    <AppLayout>
      <ProfileLayout>
        <section className="flex flex-col items-start w-full px-4 mx-auto mt-6 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-4">
          <ProfileCard user={user} />
        </section>
      </ProfileLayout>
    </AppLayout>
  );
};

export default ProfileIndexPage;

const ProfileCard = ({ user }: { user: ExtendedUser }) => {
  return (
    <div className="relative inline-flex w-full bg-primary">
      <span className="z-10 flex items-center h-full pl-4 bg-primary w-fit">
        <Avatar
          user={user}
          className="w-16 h-16 text-xl bg-black text-primary"
        />
      </span>

      <span className="relative flex flex-col -left-2 h-fit">
        <HeroTitle
          text={(user.name as string).toLowerCase()}
          className="capitalize text-[2.25rem] md:text-[4rem]"
        />

        <div className="relative z-10 flex flex-col truncate left-6 -top-6 md:-top-10">
          <strong className="text-xs uppercase md:text-base">
            {`${
              campusList.find((c) => c.value === user.preferences?.campus)
                ?.label || "Campus inconnu."
            } - ${
              audienceList.find(
                (a) => a.value === user.preferences?.promotion.split(":")[0]
              )?.shortLabel +
                " " +
                user.preferences?.promotion.split(":")[1] ||
              "Promotion inconnue."
            }`}
          </strong>
          {/* <span>inscrit depuis le {user.}</span> */}
        </div>
      </span>
    </div>
  );
};
