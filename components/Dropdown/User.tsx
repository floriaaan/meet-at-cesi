import {
  Avatar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import {
  ChevronRightIcon,
  CogIcon,
  MoonIcon,
  UserRemoveIcon,
} from "@heroicons/react/solid";

import { __MOCK_USERS__ } from "mocks/mock_users";

export const UserDropdown = () => {
  return (
    <Menu placement="bottom-start">
      <MenuHandler>
        <Avatar
          size="md"
          variant="circular"
          src="https://i.pravatar.cc/300"
          alt="User picture"
        />
      </MenuHandler>
      <MenuList className="w-[calc(100%-4rem)] p-6  rounded-xl bg-[#F7F6F3]  font-heading">
        <MenuItem className="inline-flex items-center justify-between p-5 rounded-xl bg-[#EBE8E0] mb-2">
          <div className="inline-flex items-center text-secondary grow">
            <Avatar
              size="sm"
              variant="circular"
              src="https://i.pravatar.cc/300"
              alt="User picture"
            />
            <div className="flex flex-col ml-2 grow">
              <h3 className="text-lg font-bold">
                {__MOCK_USERS__[0].fullName}
              </h3>
              <h4 className="text-sm font-medium">
                {__MOCK_USERS__[0].promotion}
              </h4>
            </div>
            <ChevronRightIcon className="w-4 h-4" />
          </div>
        </MenuItem>
        <MenuItem className="inline-flex items-center text-[#4C4C4C]">
          <UserRemoveIcon className="w-5 h-5 mr-2" />
          Se déconnecter
        </MenuItem>
        <hr className="my-1 border-secondary-100" />
        <MenuItem className="inline-flex items-center text-[#4C4C4C]">
          <CogIcon className="w-5 h-5 mr-2" />
          Paramètres
        </MenuItem>
        <hr className="my-1 border-secondary-100" />

        <MenuItem className="inline-flex items-center text-[#4C4C4C]">
          <MoonIcon className="w-5 h-5 mr-2" />
          Thème sombre
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
