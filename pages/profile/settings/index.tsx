import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";

import prisma from "@/lib/prisma";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProfileLayout } from "@/components/Layout/Profile/ProfileLayout";
import { HeroTitle } from "@/components/UI/HeroTitle";
import { PreferencesForm } from "@/components/Profile/PreferencesForm";
import { ExtendedUser } from "@/types/User";

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
    where: {
      email: session.user?.email,
    },
    include: {
      preferences: true,
    },
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
        <section className="flex flex-col items-start w-full px-4 mx-auto mt-6 md:px-12 lg:px-0 lg:max-w-3xl xl:max-w-4xl gap-y-4">
          <HeroTitle text="Paramètres" />
          <div className="flex flex-col w-full divide-y">
            <PreferencesSection preferences={user.preferences} />
          </div>
        </section>
      </ProfileLayout>
    </AppLayout>
  );
};

export default ProfileSettingsPage;

const PreferencesSection = ({
  preferences,
}: {
  preferences: ExtendedUser["preferences"];
}) => {
  console.log(preferences);
  return (
    <div className="flex flex-col w-full p-4 gap-y-2 scroll-mt-48" id="campus">
      <h3 className="text-xl font-bold">
        Sélection du campus et de la promotion
      </h3>
      <PreferencesForm
        onSubmit={() => {
          return Promise.resolve(true);
        }}
      />
    </div>
  );
};
