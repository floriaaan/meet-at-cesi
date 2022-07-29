import { ChevronLeftIcon, PlusIcon } from "@heroicons/react/solid";
import { EventList } from "components/Event/List";
import { HomeHeader } from "components/Header/HomeHeader";
import { AppLayout } from "components/Layout/AppLayout";
import { Button } from "components/UI/Button/Button";
import { ChipElement } from "components/UI/Chip/Chip";
import { ChipList } from "components/UI/Chip/ChipList";
import { __MOCK_EVENTS__ } from "mocks/mock_events";
import { NextPage } from "next";
import { useState } from "react";

import { motion } from "framer-motion";

const DEFAULT_CHIP = {
  label: "Tous",
  value: "all",
};

const EventCreate: NextPage = () => {
  const [selectedChip, setSelectedChip] = useState<ChipElement>(DEFAULT_CHIP);

  return (
    <AppLayout allowScroll={false}>
      <HomeHeader title=" " subtitle=" " />
      <motion.h3
        layoutId={`event:header`}
        className="text-2xl font-bold font-heading"
      >
        Évenements
      </motion.h3>

      <div className="flex flex-col h-[75vh]">
        <div className="my-4 overflow-x-auto shrink-0">
          <ChipList
            list={[
              DEFAULT_CHIP,
              {
                label: "Week-end d’intégration",
                value: "week-end-integration",
              },
              {
                label: "Inter-promotions",
                value: "interpromotions",
              },
              {
                label: "RIL 21",
                value: "ril-21",
              },
            ]}
            size="normal"
            selected={selectedChip}
            setSelected={setSelectedChip}
          />
        </div>
        <div className="grow">
          <EventList events={__MOCK_EVENTS__} height="h-full" />
        </div>
        <div className="grid items-center grid-cols-2 gap-5 mt-4 shrink-0">
          <Button
            href="/"
            size="large"
            variant="tertiary"
            icon={<ChevronLeftIcon className="w-6 h-6 stroke-2" />}
            layoutId={`event:all`}
          >
            Retour
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
      </div>
    </AppLayout>
  );
};

export default EventCreate;
