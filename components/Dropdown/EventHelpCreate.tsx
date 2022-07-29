import { Menu, MenuHandler, MenuList } from "@material-tailwind/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { Button } from "components/UI/Button/Button";

export const EventHelpCreateDropdown = () => {
  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <QuestionMarkCircleIcon className="w-7 h-7" />
      </MenuHandler>
      <MenuList className="p-6 w-[calc(80%-4rem)] flex flex-col gap-1 text-secondary rounded-xl bg-[#F7F6F3]  font-heading">
        <p className="text-justify">
          Ce formulaire est soumis au RGPD, de plus, merci de ne pas inclure de
          message offensant dans le formulaire.
        </p>
        <div className="inline-flex justify-end w-full">
          <Button>Ok</Button>
        </div>
      </MenuList>
    </Menu>
  );
};
