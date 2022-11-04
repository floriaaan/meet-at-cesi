import type { NextPage } from "next";
import { useState } from "react";

import type { ExtendedEvent } from "@/types/Event";
import prisma from "@/lib/prisma";
import { AppLayout } from "@/components/Layout/AppLayout";
import { EventList } from "@/components/Event/List";
import { HeroTitle } from "@/components/UI/HeroTitle";
import { Searchbar } from "@/components/UI/Searchbar";
import { FilterSidebar } from "@/components/Event/FilterSidebar";

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

const EventIndexPage: NextPage<Props> = ({ events: initialEvents }) => {
  const [events, setEvents] = useState<ExtendedEvent[]>(initialEvents);
  return (
    <AppLayout>
      <section className="flex flex-col h-full mx-auto lg:gap-x-8 lg:py-8 lg:flex-row lg:px-12">
        <div className="flex flex-col w-full lg:max-h-[78vh] lg:sticky lg:top-32 bg-gray-100 lg:w-2/5">
          <FilterSidebar events={events} setEvents={setEvents} />
        </div>
        <div className="w-full h-full pb-4 bg-gray-100 lg:bg-transparent">
          <div className="flex flex-col w-full max-w-lg p-3 pt-8 mx-auto bg-white shadow md:max-w-xl lg:pt-0 lg:mx-0 lg:shadow-none lg:p-0 lg:max-w-max">
            <HeroTitle text="Les événements à venir" />
            <div className="p-4 px-6 -mt-8 bg-primary">
              <div className="w-full xl:w-4/5">
                <Searchbar className="border border-black" />
              </div>
            </div>
            <EventList
              className="w-full mt-2 sm:px-4 md:mt-6"
              events={events}
            />
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default EventIndexPage;


