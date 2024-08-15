import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";



export default function GenericListBox({options}) {
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="w-full relative ">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative">
          <ListboxButton className="focus:shadow block w-full rounded-lg bg-white py-1.5 pr-8 pl-3 text-left text-sm/6 border border-gray-300 text-gray-800 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25">
            {selected.name}
            <ChevronDownIcon
              className="pointer-events-none absolute top-2.5 right-2.5 size-4 text-gray-800"
              aria-hidden="true"
            />
          </ListboxButton>
          <ListboxOptions className="shadow cursor-pointer absolute w-full z-20 mt-1 max-h-60 overflow-auto rounded-lg bg-white p-1 focus:outline-none">
            {options.map((data) => (
              <ListboxOption
                key={data.id}
                value={data}
                className="font-medium group flex items-center gap-2 rounded py-1.5 px-3 select-none data-[focus]:bg-gray-200"
              >
                <CheckIcon className="invisible size-4 text-gray-800 group-data-[selected]:visible" />
                <div className="text-sm/6 text-gray-800">{data.name}</div>
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
}
