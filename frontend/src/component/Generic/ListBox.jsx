import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

export default function GenericListBox({
  name,
  options = [],
  disabled = false,
  selectedOption,
  loading = false,
}) {
  const [selected, setSelected] = useState(
    selectedOption ? selectedOption : "select an option"
  );

  useEffect(() => {
    if (selectedOption) setSelected(selectedOption);
  }, [selectedOption]);

  return (
    <div className="w-full relative">
      <input
        type="hidden"
        name={name}
        value={selected?.id || "select an option"}
      />
      <Listbox
        value={selected || "select an option"}
        onChange={setSelected}
        disabled={disabled}
        className={loading ? "animate-pulse" : "animate-none"}
      >
        <div className="relative">
          <ListboxButton
            className={`capitalize focus:shadow block w-full rounded-lg py-1.5 pr-8 pl-3 text-left text-sm/6 border border-gray-300 text-gray-800 focus:outline-none ${
              disabled ? "bg-[#f6f7f7]" : "bg-white"
            }`}
          >
            {selected?.name || "Select an option"}
            <ChevronDownIcon
              className="pointer-events-none absolute top-2.5 right-2.5 w-4 h-4 text-gray-800"
              aria-hidden="true"
            />
          </ListboxButton>
          <ListboxOptions
            transition
            className="shadow cursor-pointer absolute w-full mt-1 max-h-60 overflow-auto rounded-lg bg-white p-1 focus:outline-none z-10"
          >
            {options.map((data) => (
              <ListboxOption
                key={data.id}
                value={data}
                className="font-medium group flex items-center gap-2 rounded py-1.5 px-3 select-none data-[focus]:bg-gray-200"
              >
                <CheckIcon className="invisible w-4 h-4 text-gray-800 group-data-[selected]:visible" />
                <div className="text-sm/6 text-gray-800 capitalize">
                  {data.name}
                </div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
