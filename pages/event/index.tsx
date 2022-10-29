import type { NextPage } from "next";
import type { Event, User } from "@prisma/client";

import { AppLayout } from "@/components/Layout/AppLayout";
import prisma from "@/lib/prisma";
import { EventList } from "@/components/Event/List";

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

type ExtendedEvent = Event & {
  creator: User;
  participants: User[];
};

type Props = {
  events: ExtendedEvent[];
};

const EventIndexPage: NextPage<Props> = ({ events }: Props) => {
  return (
    <AppLayout>
      <section className="flex flex-col px-4 pt-4 mx-auto lg:gap-x-8 lg:pt-8 lg:flex-row lg:px-12 ">
        <div className="flex flex-col w-full bg-gray-100 lg:w-1/4"></div>
        <div className="flex flex-col w-full lg:w-3/4">
          <div className="w-full p-4 px-6 text-black bg-primary">
            <h1 className="text-[4rem] relative font-bold leading-none md:leading-normal font-heading before:block before:absolute before:-bottom-2 md:before:bottom-2 before:left-2 md:before:left-6 before:bg-white before:w-32 before:h-3">
              Les événements à venir
            </h1>
          </div>
          <EventList className="w-full mt-2 sm:px-4 md:mt-6" events={events} />
        </div>
      </section>
    </AppLayout>
  );
};

export default EventIndexPage;
