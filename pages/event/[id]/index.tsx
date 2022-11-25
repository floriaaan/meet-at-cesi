import type { GetServerSideProps, NextPage } from "next";

import toast from "react-hot-toast";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";

import type { ExtendedEvent } from "@/types/Event";
import toastStyle from "@/resources/toast.config";
import prisma from "@/lib/prisma";
import { participate } from "@/lib/fetchers";
import { AppLayout } from "@/components/Layout/AppLayout";
import { HeroSection } from "@/components/Event/Hero/Section";
import { MapSection } from "@/components/Event/Map/Section";
import { ParticipantSection } from "@/components/Event/Participant/Section";
import { CommentSection } from "@/components/Event/Comment/Section";

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
      comments: {
        include: { author: true, children: { include: { author: true } } },
      },
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
    comments: initialComments,
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
        isParticipant ? "Désinscription en cours..." : "Inscription en cours",
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
      <NextSeo title={title} />
      <section className="flex flex-col items-start w-full h-full px-4 pt-6 mx-auto md:px-12 lg:px-0 lg:max-w-5xl xl:max-w-6xl gap-y-4">
        <HeroSection
          id={id}
          title={title}
          date={date}
          location={location}
          campus={audienceCampus}
          audience={audience}
          creator={creator}
          isParticipant={isParticipant}
          isOwner={isOwner}
          participate={handleParticipate}
        />
        <div className="grid w-full grid-cols-3 gap-4 pb-4 ">
          <div className="w-full col-span-3 lg:col-span-2">
            <MapSection location={location} />
          </div>
          <div className="w-full col-span-3 lg:col-span-1">
            <ParticipantSection participants={participants} eventId={id} />
          </div>
          <div className="w-full col-span-3">
            <CommentSection initialComments={initialComments} />
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default EventPage;
