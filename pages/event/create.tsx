import {
  QuestionMarkCircleIcon,
  CalendarIcon,
  LocationMarkerIcon,
} from "@heroicons/react/solid";
import { Input } from "@material-tailwind/react";
import { EventHelpCreateDropdown } from "components/Dropdown/EventHelpCreate";
import { LeftButton, StickyHeader } from "components/Header/StickyHeader";
import { AppLayout } from "components/Layout/AppLayout";
import { Button } from "components/UI/Button/Button";
import { NextPage } from "next";

const EventCreate: NextPage = () => {
  return (
    <AppLayout>
      <StickyHeader
        left={<LeftButton />}
        right={<EventHelpCreateDropdown />}
        title="Créer un évenement"
      />
      <div className="relative flex flex-col justify-between h-[80vh] gap-6 pt-4 mb-8 grow">
        <div className="flex flex-col w-full gap-4 h-max grow ">
          <div className="w-full bg-red-500 h-36 rounded-xl"></div>
          <Input color="amber" size="lg" label="Nom de l'évenement" />
          <Input
            type="datetime-local"
            color="amber"
            size="lg"
            label="Date et heure"
            icon={<CalendarIcon className="peer-focus:text-amber-500" />}
          />
          <Input
            color="amber"
            size="lg"
            label="Lieu du rendez-vous"
            icon={<LocationMarkerIcon className="peer-focus:text-amber-500" />}
          />
          <Input color="amber" size="lg" label="Promotion" />
        </div>
        <Button
          type="button"
          size="large"
          variant="tertiary"
          rounded="rounded-xl"
        >
          {"Créer l'évenement"}
        </Button>
      </div>
    </AppLayout>
  );
};

export default EventCreate;
