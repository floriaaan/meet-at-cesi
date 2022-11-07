import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

import type { ExtendedEvent } from "@/types/Event";
import prisma from "@/lib/prisma";
import { AppLayout } from "@/components/Layout/AppLayout";
import { EventList } from "@/components/Event/List";
import { HeroTitle } from "@/components/UI/HeroTitle";
import { Searchbar } from "@/components/UI/Searchbar";
import { FilterSidebar } from "@/components/Event/FilterSidebar";
import { search } from "@/lib/fetchers";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  if (query.campus || query.promotion) {
    const session = await getSession(context);
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email as string },
      include: { preferences: true },
    });
    if (!user) throw new Error("User not found");
    if (query.campus === "user_preferred_campus")
      return {
        redirect: {
          destination: `/event?campus=${user.preferences?.campus}`,
          permanent: false,
        },
      };
    if (query.promotion === "user_preferred_promotion")
      return {
        redirect: {
          destination: `/event?promotion=${user.preferences?.promotion}`,
          permanent: false,
        },
      };
  }

  let events = await prisma.event.findMany({
    include: {
      creator: true,
      participants: true,
    },
    orderBy: {
      date: "asc",
    },
    where: {
      date: {
        gte: new Date(),
      },
    },
  });
  events = JSON.parse(JSON.stringify(events));

  return {
    props: {
      events,
    },
  };
};

type Props = {
  events: ExtendedEvent[];
};

const EventIndexPage: NextPage<Props> = ({ events: initialEvents }) => {
  const { query } = useRouter();
  const [events, setEvents] = useState<ExtendedEvent[]>(initialEvents);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (query && Object.keys(query).length > 0) {
      setLoading(true);
      search(query).then((events) => {
        setEvents(events);
        setLoading(false);
      });
    }
  }, [query]);

  return (
    <AppLayout>
      <section className="flex flex-col h-auto min-h-full pb-4 mx-auto bg-gray-100 lg:gap-x-8 lg:py-8 lg:flex-row lg:px-12 lg:bg-transparent">
        <div className="flex flex-col pt-4 lg:pt-0 w-full lg:max-h-[78vh] lg:sticky lg:top-32 bg-white lg:bg-gray-100 lg:w-2/5 max-w-lg md:max-w-xl lg:max-w-xs mx-auto lg:mx-0">
          <FilterSidebar setEvents={setEvents} setLoading={setLoading} />
        </div>
        <div className="flex flex-col w-full max-w-lg p-3 mx-auto bg-white md:max-w-xl lg:pt-0 2xl:max-w-7xl lg:shadow-none lg:p-0 lg:max-w-4xl">
          <HeroTitle text="Les événements à venir" />
          <div className="p-4 px-6 -mt-8 bg-primary">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form[0] as HTMLInputElement;
                if (
                  input.value &&
                  typeof input.value === "string" &&
                  input.value !== ""
                ) {
                  setLoading(true);
                  const events = await search({
                    name: input.value,
                    dateMin: undefined,
                    dateMax: undefined,
                    proximity: undefined,
                    campus: undefined,
                  });
                  setLoading(false);
                  setEvents(events);
                } else {
                  setEvents(initialEvents);
                }
              }}
              className="w-full xl:w-4/5"
            >
              <Searchbar className="border border-black" loading={loading} />
            </form>
          </div>
          <EventList className="w-full mt-2 sm:px-4 md:mt-6" events={events} />
        </div>
      </section>
    </AppLayout>
  );
};

export default EventIndexPage;
