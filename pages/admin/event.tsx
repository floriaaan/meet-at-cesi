import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";

import prisma from "@/lib/prisma";
import CustomTable from "@/components/Admin/CustomTable";
import { AppLayout } from "@/components/Layout";
import { AdminLayout } from "@/components/Layout/Admin/Layout";
import { ExtendedSession } from "@/types/Session";
import { ExtendedEvent } from "@/types/Event";
import { EventTableItem } from "@/components/Admin/CustomTable/Event/Item";

type Props = {
  events: ExtendedEvent[];
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = (await getSession(context)) as ExtendedSession;
  if (
    !session?.user ||
    !(session?.user?.role === "ADMIN" || session?.user?.role === "MODERATOR")
  ) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let events = await prisma.event.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      comments: { include: { author: true, children: true } },
      creator: true,
      participants: true,
    },
  });

  events = JSON.parse(JSON.stringify(events));

  return {
    props: { events },
  };
};

const AdminEventPage: NextPage<Props> = ({ events }) => {
  return (
    <AppLayout>
      <AdminLayout>
        <NextSeo title="Événements, admin." />
        <div className="lg:p-4">
          <CustomTable
            title="Événements"
            items={events}
            columns={["Titre", "Créateur", "Participants", "Commentaires"]}
            renderItem={(event) => <EventTableItem {...event} key={event.id} />}
          />
        </div>
      </AdminLayout>
    </AppLayout>
  );
};

export default AdminEventPage;
