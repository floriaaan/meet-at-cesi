import { EventShowcase } from "components/Event/Showcase";
import { HomeHeader } from "components/Header/HomeHeader";
import { AppLayout } from "components/Layout/AppLayout";
import type { NextPage } from "next";
import { EventList } from "components/Event/List";
import { Button } from "components/UI/Button/Button";
import { EyeIcon, PlusIcon } from "@heroicons/react/outline";
import { ChatIcon as ChatIconSolid } from "@heroicons/react/solid";
import { Caption } from "components/UI/Caption";
import { __MOCK_EVENTS__ } from "mocks/mock_events";

import { motion } from "framer-motion";

const Home: NextPage = () => {
  return (
    <AppLayout>
      <HomeHeader />
      <div className="overflow-y-hidden">
        <div className="mt-4">
          <EventShowcase {...__MOCK_EVENTS__[0]} />
        </div>
        <motion.h3 layoutId={`event:header`} className="my-4">
          Évenements
        </motion.h3>
        <EventList events={__MOCK_EVENTS__.slice(1)} height="h-40" />
        <div className="grid items-center grid-cols-2 gap-5 mt-4">
          <Button
            href="/event"
            size="large"
            variant="tertiary"
            icon={<EyeIcon className="w-6 h-6 stroke-2" />}
            layoutId={`event:all`}
          >
            Voir tout
          </Button>
          <Button
            href="/event/create"
            size="large"
            variant="tertiary"
            icon={<PlusIcon className="w-6 h-6 stroke-2" />}
            layoutId={`event:create`}
          >
            Créer
          </Button>
        </div>
        <div className="mt-4">
          <Caption
            variant="secondary"
            size="large"
            className="w-full"
            icon={
              <ChatIconSolid className="w-6 h-6 stroke-2 text-secondary-300" />
            }
          >
            {"P'tite bière ?"}
          </Caption>
        </div>
      </div>
    </AppLayout>
  );
};

export default Home;

//todo: getServerSideProps to auto-redirect to auth/index if first visit else to auth/login
