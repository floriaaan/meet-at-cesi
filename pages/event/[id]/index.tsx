import type { GetServerSideProps, NextPage } from "next";

import toast from "react-hot-toast";
import { useState } from "react";
import { useSession } from "next-auth/react";

import type { ExtendedEvent } from "@/types/Event";
import campusList from "@/resources/campus-list";
import toastStyle from "@/resources/toast.config";
import audienceList from "@/resources/audience-list";
import prisma from "@/lib/prisma";
import { participate } from "@/lib/fetchers";
import { AppLayout } from "@/components/Layout/AppLayout";
import { HeroSection } from "@/components/Event/HeroSection";
import { MapSection } from "@/components/Event/MapSection";
import { ParticipantsSection } from "@/components/Event/ParticipantsSection";

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
          audience={
            audienceList.find((a) => a.value === audience)?.shortLabel || ""
          }
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
