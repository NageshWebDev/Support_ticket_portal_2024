import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon
} from "@heroicons/react/16/solid";
import { NavLink } from "react-router-dom";

export default function DropdownMenu() {
  return (
    <div className="w-max relative">
      <Menu>
        <MenuButton className="tracking-wider inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold bg-[#444] hover:bg-[#333] text-gray-100 shadow-inner border">
          Manage Ticket
          <ChevronDownIcon className="size-4 gray-500" />
        </MenuButton>

        <MenuItems
          transition
          className="absolute mt-0.5 right-0 bg-white shadow-lg border w-40 origin-top-right rounded-md p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem className="flex justify-between">
            <NavLink
              to="ticket/create"
              className="font-medium group flex w-full items-center rounded py-1.5 px-3 hover:bg-gray-200 text-gray-800"
            >
              <PencilIcon className="size-4 group-hover:translate-x-2 transition-all duration-500" />
              Create Ticket
            </NavLink>
          </MenuItem>
          <MenuItem className="flex justify-between">
            <NavLink
              to="ticket/view"
              className="font-medium group flex w-full items-center rounded py-1.5 px-3 hover:bg-gray-200 text-gray-800"
            >
              <Square2StackIcon className="size-4 group-hover:translate-x-2 transition-all duration-500" />
              View Tickets
            </NavLink>
          </MenuItem>
          
        </MenuItems>
      </Menu>
    </div>
  );
}
