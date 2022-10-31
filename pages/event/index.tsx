import type { NextPage } from "next";

import type { ExtendedEvent } from "@/types/Event";
import prisma from "@/lib/prisma";
import { AppLayout } from "@/components/Layout/AppLayout";
import { EventList } from "@/components/Event/List";
import { HeroTitle } from "@/components/UI/HeroTitle";

export async function getServerSideProps() {
  let events = await prisma.event.findMany({
    include: {
      creator: true,
      participants: true,
    },
    orderBy: {
      date: "asc",
    },
  });
  events = JSON.parse(JSON.stringify(events));

  return {
    props: {
      events,
    },
  };
}


type Props = {
  events: ExtendedEvent[];
};

const EventIndexPage: NextPage<Props> = ({ events }: Props) => {
  return (
    <AppLayout>
      <section className="flex flex-col px-4 pt-4 mx-auto lg:gap-x-8 lg:pt-8 lg:flex-row lg:px-12 ">
        <div className="flex flex-col w-full bg-gray-100 lg:w-1/4"></div>
        <div className="flex flex-col w-full lg:w-3/4">
          <HeroTitle text="Les événements à venir" />
          <EventList className="w-full mt-2 sm:px-4 md:mt-6" events={events} />
        </div>
      </section>
    </AppLayout>
  );
};

export default EventIndexPage;
