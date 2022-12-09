import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { NextSeo } from "next-seo";

import campusList from "@/resources/campus-list";
import { AppLayout } from "@/components/Layout";
import { SearchBar } from "@/components/UI/SearchBar";
import prisma from "@/lib/prisma";
import { ExtendedEvent } from "@/types/Event";
import { EventList } from "@/components/Event/List";

const POSSIBLE_CAPTIONS = [
  "Petite bière après les cours ? 🍻",
  "On va réviser ? 📚",
  "On va faire la fête ? 🎉",
  "On court ensemble ce midi ? 🏃‍♂️",
];
export const getServerSideProps: GetServerSideProps = async () => {
  const caption =
    POSSIBLE_CAPTIONS[Math.floor(Math.random() * POSSIBLE_CAPTIONS.length)];

  // const nextEvents = await prisma.event.findMany({
  //   where: { date: { gte: new Date() } },
  //   orderBy: { date: "asc" },
  //   take: 3,
  //   include: { creator: true, participants: true },
  // });
  return {
    props: {
      caption,
      // nextEvents: JSON.parse(JSON.stringify(nextEvents)),
    },
  };
};

type Props = {
  caption: string;
  // nextEvents: ExtendedEvent[];
};

const Home: NextPage<Props> = ({
  caption,
  //  nextEvents
}) => {
  const router = useRouter();
  return (
    <AppLayout>
      <NextSeo title="Accueil" />
      <section className="relative w-full h-[50vh] md:h-[70vh]">
        <Image
          priority={false}
          src={"/img/hero.avif"}
          alt="Hero image"
          width={360}
          height={200}
          quality={1}
          sizes="33vw"
          className="absolute top-0 left-0 object-cover w-full h-full blur"
        />

        <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-gradient-to-b from-transparent to-black" />
        <div className="absolute left-0 right-0 flex flex-col items-start w-full h-full px-4 mx-auto md:px-12 xl:px-0 xl:max-w-6xl gap-y-8 -bottom-24 md:-bottom-48 xl:-bottom-64 ">
          <h1 className="text-7xl title">{caption}</h1>
          <div className="flex flex-col w-full">
            <div className="flex flex-col items-center w-full px-4 pt-4 pb-6 bg-purple gap-y-4 lg:gap-y-0 lg:flex-row xl:pb-4 ">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const input = form[0] as HTMLInputElement;
                  if (
                    input.value &&
                    typeof input.value === "string" &&
                    input.value !== ""
                  ) {
                    router.push(`/event?name=${input.value}`);
                  }
                }}
                className="flex flex-col w-full"
              >
                <SearchBar className="input__shadow-purple" />
              </form>
            </div>
            <div className="w-full px-8 py-6 bg-white shadow-2xl font-body">
              <span className="pb-2 pr-2 bg-white">
                Découvrez les événements organisés par des étudiant.e.s CESI
              </span>
              <div
                className="flex flex-wrap p-6 -mt-3 border border-black gap-x-2 gap-y-3 md:gap-4"
                data-testid="home-campus-list"
              >
                {campusList.sort().map((campus) => (
                  <Link
                    href={`/event?campus=${campus.value}`}
                    className="btn__pill"
                    key={campus.value}
                  >
                    {campus.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <div className="relative flex flex-col items-center w-full px-4 mx-auto mt-48 mb-24 xl:mt-24 md:px-12 xl:px-0 xl:max-w-6xl">
        <EventList events={nextEvents} />
      </div> */}
    </AppLayout>
  );
};

export default Home;
