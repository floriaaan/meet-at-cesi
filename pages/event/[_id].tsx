import { ChevronLeftIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import { EventDropdown } from "components/Dropdown/Event";
import { Details } from "components/Event/Details";
import { Participants } from "components/Event/Participants";
import { LeftButton, StickyHeader } from "components/Header/StickyHeader";
import { AppLayout } from "components/Layout/AppLayout";
import { Button } from "components/UI/Button/Button";
import { __MOCK_EVENTS__ } from "mocks/mock_events";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { Event } from "types/Event";

type Props = Event;

const EventSlug: NextPage<Props> = ({
  // _id,
  name,
  participants,
  schedule,
  location,
  targetAudience,
}: Props) => {
  return (
    <AppLayout padding="pb-4" allowScroll>
      <StickyHeader
        left={<LeftButton />}
        right={<EventDropdown />}
        title={name}
        padding="px-8 pt-8 pb-2"
      />
      <div className="flex flex-col h-full gap-4 px-8 mt-4 mb-8 overflow-y-scroll">
        <div className="overflow-hidden h-72 rounded-2xl">
          {location && (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2594.7928046172165!2d1.0915696156661312!3d49.43173106811927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e0df7fb9b10537%3A0xeab8175afbda8b!2sLe%20Quartier%20Libre%20de%20Rouen!5e0!3m2!1sfr!2sfr!4v1657451204775!5m2!1sfr!2sfr"
              width={"100%"}
              height="288"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          )}
        </div>
        <Details
          location={location}
          schedule={schedule}
          targetAudience={targetAudience}
        />
        <Button size="large" variant="tertiary" type="button">
          {"J'y vais !"}
        </Button>
        <Participants participants={participants} />
      </div>
    </AppLayout>
  );
};

export default EventSlug;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const _id = context.query["_id"] as string;

  return {
    props: __MOCK_EVENTS__.find((event) => event._id === _id) as Event,
  };
};
