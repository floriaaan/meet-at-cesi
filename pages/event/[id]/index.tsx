import type { User, Event } from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";

import { useState } from "react";
import { useSession } from "next-auth/react";
import classNames from "classnames";
import Link from "next/link";
import toast from "react-hot-toast";

import prisma from "@/lib/prisma";
import campusList from "@/resources/campus-list";
import toastStyle from "@/resources/toast.config";
import { AppLayout } from "@/components/Layout/AppLayout";
import { HeroTitle } from "@/components/UI/HeroTitle";
import { useFetchXHR } from "@/hooks/useFetchXHR";
import { participate } from "@/lib/fetchers";
import {
  MdAccountCircle,
  MdCalendarToday,
  MdGridView,
  MdList,
  MdLocationPin,
  MdPerson,
} from "react-icons/md";
import audienceList from "@/resources/audience-list";

type ExtendedEvent = Event & {
  creator: User;
  participants: User[];
};

type Props = {
  event: ExtendedEvent;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  let event = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      creator: true,
      participants: true,
    },
  });

  event = JSON.parse(JSON.stringify(event));

  return {
    props: {
      event,
    },
  };
};

const EventPage: NextPage<Props> = (props: Props) => {
  const { data: session } = useSession();
  const {
    creator,
    participants: initialParticipants,
    title,
    audience,
    audienceCampus,
    id,
    location,
    date,
  } = props.event;
  const [participants, setParticipants] = useState(initialParticipants);

  const isParticipant = participants.some(
    (p) => p.email === session?.user?.email
  );
  const isOwner = creator.email === session?.user?.email;

  const handleParticipate = async () => {
    let toastId: string | undefined;
    try {
      toastId = toast.loading(
        isParticipant ? "Désincription en cours..." : "Inscription en cours",
        toastStyle
      );
      participate(id).then((result) => {
        if (result) {
          toast.success(
            isParticipant
              ? "Participation retirée 😔"
              : "Participation réussie 😍",
            { id: toastId }
          );
          setParticipants(result.participants);
        } else
          toast.error("Erreur lors de la participation 😭", {
            id: toastId,
          });
      });
    } catch (e) {
      console.error(e);
      toast.error("Unable to submit", { id: toastId });
    }
  };

  return (
    <AppLayout>
      <section className="flex flex-col items-start w-full h-full px-4 mx-auto mt-6 md:px-12 lg:px-0 lg:max-w-5xl xl:max-w-6xl gap-y-4">
        <HeroSection
          id={id}
          title={title}
          date={date}
          location={location}
          campus={
            campusList.find((c) => c.value === audienceCampus)?.label || ""
          }
          audience={audienceList.find((a) => a.value === audience)?.label || ""}
          creator={creator}
          isParticipant={isParticipant}
          isOwner={isOwner}
          participate={handleParticipate}
        />
        <div className="flex flex-col w-full gap-4 mb-16 lg:flex-row">
          <div className="w-full lg:w-2/3">
            <MapSection location={location} />
          </div>
          <div className="w-full lg:w-1/3">
            <ParticipantsSection participants={participants} />
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default EventPage;

const HeroSection = ({
  id,
  title,
  date,
  location,
  campus,
  audience,
  creator,
  isParticipant,
  isOwner,

  participate,
}: {
  id: string;
  title: string;
  date: Date;
  location: string;
  campus: string;
  audience: string;
  creator: User;

  isParticipant: boolean;
  isOwner: boolean;

  participate: () => void;
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="inline-flex items-end justify-between w-full">
        <div className="overflow-hidden text-white uppercase">
          <div
            className={classNames(
              "hidden sm:inline-block", // responsive : hidden on small screens like mobile
              "relative mb-8 ml-12 bg-black py-1 pr-4 text-sm",
              "before:absolute before:top-[3.8rem] before:w-[11rem] before:h-[150%] before:bg-black before:translate-x-[-100%] before:left-0 before:skew-y-[-35deg]",
              "after:translate-y-[100%] after:absolute after:bg-black after:right-[7.85rem] after:bottom-0 after:w-[150%] after:h-[11rem] after:skew-x-[-55deg] "
            )}
          >
            <div className="inline-flex items-start py-2 divide-x-2 divide-white gap-x-4">
              <div className="flex flex-col">
                <span className="">Campus</span>
                <strong
                  // @ts-ignore
                  before="_"
                  className={classNames(
                    "relative -mt-1.5 -mb-1 w-min md:w-auto",
                    "before:content-[attr(before)] before:absolute before:right-[100%]"
                  )}
                >
                  {campus}
                </strong>
              </div>
              <div className="flex flex-col pl-4">
                <span className="">Invités</span>
                <strong
                  // @ts-ignore
                  before="_"
                  className={classNames(
                    "relative -mt-1.5 -mb-1 w-min xs:w-auto",
                    "before:content-[attr(before)] before:absolute before:right-[100%]"
                  )}
                >
                  {audience}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end ml-2 md:gap-2 md:flex-row md:pr-2 lg:ml-0">
          {isOwner && (
            <Link href={`/event/${id}/edit`}>
              <a className="py-2.5 btn-black">Modifier</a>
            </Link>
          )}
          <button className="py-2.5 btn-black" onClick={() => participate()}>
            {isParticipant ? "Ne plus participer" : "Participer"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <HeroTitle text={title} />
        <div className="flex flex-col items-start justify-start px-6 py-2 -mt-4 text-sm font-bold md:-mt-12 lg:mt-0 md:px-2 md:items-end whitespace-nowrap bg-primary">
          <div className="inline-flex items-center text-black gap-x-1">
            <MdLocationPin className="w-4 h-4" />
            {location}
          </div>
          <div className="inline-flex items-center text-black gap-x-1">
            <MdCalendarToday className="w-4 h-4" />
            {new Date(date).toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="inline-flex items-center text-black sm:hidden gap-x-1">
            <MdPerson className="w-4 h-4" />
            {audience} - {campus}
          </div>
          <div className="inline-flex items-center text-black gap-x-1">
            <MdAccountCircle className="w-4 h-4" />
            {creator.name}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Map Section
 * TODO: exports to seperate files
 */

type MapFeature = {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    name: string;
    score: number;
    postcode: string;
    city: string;
    context: string;
  };
};

const MapSection = ({ location }: { location: string }) => {
  const {
    data,
    loading,
    error,
  }: {
    data?: { features: MapFeature[] };
    loading: boolean;
    error?: any;
  } = useFetchXHR(`https://api-adresse.data.gouv.fr/search/?q=${location}`);
  const fetchedLocation = data?.features[0];

  return (
    <div className="w-full p-4 bg-black">
      <div className="w-full h-96">
        {loading && <p>Chargement...</p>}
        {error && <p>Erreur</p>}
        {fetchedLocation && <Map location={fetchedLocation} />}
      </div>
    </div>
  );
};

const Map = ({ location }: { location: MapFeature }) => {
  return (
    <iframe
      width="100%"
      height="100%"
      frameBorder="0"
      scrolling="no"
      marginHeight={0}
      marginWidth={0}
      src={`https://maps.google.com/maps?q=${location.properties.name}%20${location.properties.context}&z=14&amp&output=embed`}
    ></iframe>
  );
};

/**
 * Participants Section
 * TODO: exports to seperate files
 */

const ParticipantsSection = ({ participants }: { participants: User[] }) => {
  const [display, setDisplay] = useState<"column" | "grid">("column");
  return (
    <div className="flex flex-col w-full h-full p-4 bg-gray-100 gap-y-2">
      <div className="inline-flex justify-between w-full ">
        <p className="inline-flex items-center gap-x-1">
          <strong>{participants.length}</strong> participant(s)
        </p>
        <div className="inline-flex items-center gap-x-2">
          <button className="btn__pill">Inviter</button>
          <button
            className="px-1 py-1 md:px-2 md:py-2 btn__pill"
            onClick={() =>
              setDisplay((oldValue) =>
                oldValue === "column" ? "grid" : "column"
              )
            }
          >
            {display === "grid" ? (
              <MdGridView className="w-4 h-4 text-current shrink-0" />
            ) : (
              <MdList className="w-4 h-4 text-current shrink-0" />
            )}
          </button>
        </div>
      </div>
      <div
        className={classNames(
          "w-full gap-2 mt-2 overflow-y-auto h-80",
          display === "grid"
            ? "grid grid-cols-2 lg:grid-cols-3 grid-rows-3"
            : "flex flex-col"
        )}
      >
        {participants.map((participant) => (
          <ParticipantCard
            style={display}
            key={participant.id}
            participant={participant}
          />
        ))}
      </div>
    </div>
  );
};

const ParticipantCard = ({
  participant,
  style,
}: {
  participant: User;
  style: "column" | "grid";
}) => {
  return (
    <div
      className={classNames({
        "inline-flex items-center w-full h-fit gap-x-2 border-b pb-2 last:border-b-0":
          style === "column",
        "flex flex-col justify-center items-center gap-y-2": style === "grid",
      })}
    >
      {participant.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={participant.image}
          alt={participant.name || "Participant picture"}
          className={classNames("rounded-full", {
            "w-8 h-8": style === "column",
            "w-16 h-16": style === "grid",
          })}
        />
      ) : (
        <span
          className={classNames(
            "rounded-full select-none flex justify-center items-center bg-primary font-bold",
            {
              "w-8 h-8 text-xs": style === "column",
              "w-16 h-16 text-xl": style === "grid",
            }
          )}
        >
          {participant.name
            ? participant.name.split(" ")[0][0] +
              participant.name.split(" ")[1][0]
            : "?"}
        </span>
      )}
      <p
        className={classNames(" h-fit font-bold truncate w-4/5", {
          "text-base": style === "column",
          "text-xs text-center ": style === "grid",
        })}
      >
        {participant.name}
      </p>
    </div>
  );
};
