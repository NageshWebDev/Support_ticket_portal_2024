import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  InboxStackIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { filterTicketData } from "../../store/feature/ticketSlice";

const iconMap = {
  inboxStack: InboxStackIcon,
  envelope: EnvelopeIcon,
  envelopeOpen: EnvelopeOpenIcon,
  wrenchScrewdriver: WrenchScrewdriverIcon,
};

export default function GenericFilter({ options, disabled, selectedOption }) {
  const [selected, setSelected] = useState(selectedOption);
  const dispatch = useDispatch();

  useEffect(() => {
    setSelected(selectedOption);
    dispatch(filterTicketData(selectedOption));
  }, [selectedOption]);

  return (
    <div className="relative ">
      <Listbox
        disabled={disabled}
        value={selected}
        onChange={(value) => {
          setSelected(value);
          dispatch(filterTicketData(value));
        }}
      >
        <div className="relative">
          <ListboxButton
            className={`"focus:shadow block w-32 rounded-lg bg-white py-1.5 pr-8 pl-3 text-left text-sm/6 border border-gray-300 text-gray-800 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25 
          ${disabled ? "cursor-not-allowed" : ""}
          `}
          >
            {selected.name}
            <ChevronDownIcon
              className="pointer-events-none absolute top-2.5 right-2.5 size-4 text-gray-800"
              aria-hidden="true"
            />
          </ListboxButton>
          <ListboxOptions
            transition
            className="shadow cursor-pointer absolute right-0 w-max z-20 mt-1 max-h-60 overflow-auto rounded-lg bg-white p-1 focus:outline-none"
          >
            {options.map((data) => {
              const IconComponent = iconMap[data.icon];
              return (
                <ListboxOption
                  key={data.id}
                  value={data}
                  className="font-medium group flex items-center gap-2 rounded py-1.5 px-3 select-none data-[focus]:bg-gray-200"
                >
                  <IconComponent className="size-4 text-gray-700" />
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-800">{data.name}</div>
                    <div className="text-sm text-gray-800 font-normal">
                      {data.description}
                    </div>
                  </div>
                </ListboxOption>
              );
            })}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
