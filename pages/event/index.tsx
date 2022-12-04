import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { MdArrowRightAlt } from "react-icons/md";
import Link from "next/link";

import type { ExtendedEvent } from "@/types/Event";
import prisma from "@/lib/prisma";
import { search } from "@/lib/fetchers";
import { AppLayout } from "@/components/Layout/AppLayout";
import { EventList } from "@/components/Event/List";
import { Header } from "@/components/UI/Header";
import { SearchBar } from "@/components/UI/SearchBar";
import { FilterSidebar } from "@/components/Event/FilterSidebar";
import { Chip } from "@/components/UI/Chip";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  if (query.campus || query.promotion) {
    const session = await getSession(context);
    if (session?.user?.email) {
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
      if (query.promotion === "user_preferred_promotion") {
        const splittedPromotion = user.preferences?.promotion.split(":");
        return {
          redirect: {
            destination: `/event?promotion=${
              splittedPromotion?.[0] || "undefined"
            }&campus=${user.preferences?.campus}`,
            permanent: false,
          },
        };
      }
    }
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
        // today, from 0AM
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
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
      search({
        ...query,
        dateMin: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      }).then((events) => {
        setEvents(events);
        setLoading(false);
      });
    }
  }, [query]);

  return (
    <AppLayout>
      <NextSeo title="Événements" />
      <section className="flex flex-col min-h-full pb-4 mx-auto mb-12 bg-gray-100 lg:gap-x-8 lg:py-8 lg:flex-row lg:px-12 lg:bg-transparent">
        <div className="flex h-auto flex-col pt-4 lg:pt-0 w-full lg:min-h-[80vh] lg:sticky lg:top-32 bg-white lg:bg-gray-100 lg:w-2/5 max-w-lg md:max-w-xl lg:max-w-xs mx-auto lg:mx-0">
          <FilterSidebar setEvents={setEvents} setLoading={setLoading} />
        </div>
        <div className="flex flex-col w-full h-full max-w-lg p-3 mx-auto mb-8 bg-white md:max-w-xl lg:pt-0 2xl:max-w-7xl lg:shadow-none lg:p-0 lg:max-w-4xl">
          <Header
            className="relative"
            text={
              <>
                Liste des événements{" "}
                <Chip extendClassName="text-[1.5rem] absolute bottom-6 ml-2 py-2">
                  {events.length}
                </Chip>
              </>
            }
          />
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
              <SearchBar className="border border-black" loading={loading} />
            </form>
          </div>
          <EventList className="w-full mt-2 md:mt-6" events={events} />
          {query.campus === "undefined" || query.promotion === "undefined" ? (
            <div>
              <p className="text-lg">Zût, on aurait dû vous prévenir... 😣</p>

              <p className="text-sm">
                {query.campus === "undefined" &&
                  "Vous n'avez pas de campus associé à votre profil, vous pouvez en choisir un dans vos préférences."}
                {query.promotion === "undefined" &&
                  "Vous n'avez pas de promotion associé à votre profil, vous pouvez en choisir une dans vos préférences."}
              </p>
              <Link
                href="/profile/settings#preferences"
                className="inline-flex items-center gap-1 mt-4 text-sm font-bold underline"
              >
                Aller aux préférences
                <MdArrowRightAlt className="w-4 h-4" />
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </AppLayout>
  );
};

export default EventIndexPage;
