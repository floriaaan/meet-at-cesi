import { EventShowcase } from "components/Event/Showcase";
import { HomeHeader } from "components/Header/HomeHeader";
import { AppLayout } from "components/Layout/AppLayout";
import { Event } from "types/Event";
import type { NextPage } from "next";
import { EventList } from "components/Event/List";
import { Button } from "components/UI/Button/Button";
import { EyeIcon, PlusIcon } from "@heroicons/react/outline";
import { ChatIcon as ChatIconSolid } from "@heroicons/react/solid";
import { Caption } from "components/UI/Caption";

const __MOCK_EVENTS__: Event[] = [
  {
    _id: "event-1a0",
    name: "Soirée saississante",
    location: {
      address: "Le Saxo - 11 Pl. Saint-Marc, 76000 Rouen",
      lat: 49.44,
      lng: 1.1,
    },
    targetAudience: ["Inter-promotion"],
    schedule: {
      date: "2020-01-01",
      timeFrom: "17:00",
      timeTo: "19:00",
    },
    participants: [],
  },
  {
    _id: "event-1a1",
    name: "Révisions studieuses",
    location: {
      address: "Le Saxo - 11 Pl. Saint-Marc, 76000 Rouen",
      lat: 49.44,
      lng: 1.1,
    },
    targetAudience: ["RIL21-1", "RIL21-2"],
    schedule: {
      date: "2020-01-01",
      timeFrom: "17:00",
      timeTo: "19:00",
    },
    participants: [],
  },
  {
    _id: "event-1a2",
    name: "Beuverie post-soutenance",
    location: {
      address: "Quartier Libre - 76000 Rouen",
      lat: 49.44,
      lng: 1.1,
    },
    targetAudience: ["RIL21-1", "RIL21-2"],
    schedule: {
      date: "2020-01-01",
      timeFrom: "17:00",
      timeTo: "19:00",
    },
    participants: [],
  },
];

const Home: NextPage = () => {
  return (
    <AppLayout>
      <HomeHeader />
      <div className="mt-6">
        <EventShowcase {...__MOCK_EVENTS__[0]} />
      </div>
      <h3 className="my-6">Évenements</h3>
      <EventList events={__MOCK_EVENTS__} height="h-48" />
      <div className="grid grid-cols-2 items-center gap-5 mt-5">
        <Button
          size="large"
          variant="tertiary"
          icon={<EyeIcon className="w-6 h-6 stroke-2" />}
        >
          Voir tout
        </Button>
        <Button
          size="large"
          variant="tertiary"
          icon={<PlusIcon className="w-6 h-6 stroke-2" />}
        >
          Créer
        </Button>
      </div>
      <div className="mt-5">
        <Caption
          size="large"
          className="w-full text-tertiary-300"
          icon={<ChatIconSolid className="w-6 h-6 stroke-2 text-tertiary-200" />}
        >
          {"P'tite bière ?"}
        </Caption>
      </div>
    </AppLayout>
  );
};

export default Home;
