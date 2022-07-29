import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import {
  DotsVerticalIcon,
  ExclamationCircleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/solid";

export const EventDropdown = () => {
  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <DotsVerticalIcon className="w-7 h-7" />
      </MenuHandler>
      <MenuList className="p-6 w-[calc(60%-4rem)]  text-secondary rounded-xl bg-[#F7F6F3]  font-heading">
        {true && (
          <>
            <MenuItem className="inline-flex items-center text-[#4C4C4C]">
              <PencilIcon className="w-5 h-5 mr-3" />
              Modifier
            </MenuItem>
            <hr className="my-1 border-secondary-100" />
            <MenuItem className="inline-flex items-center text-[#4C4C4C]">
              <TrashIcon className="w-5 h-5 mr-3" />
              Supprimer
            </MenuItem>
            <hr className="my-1 border-secondary-100" />
          </>
        )}
        <MenuItem className="inline-flex items-center text-[#4C4C4C]">
          <ExclamationCircleIcon className="w-5 h-5 mr-3" />
          Signaler
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
