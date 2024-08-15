import { Field, Input, Label } from "@headlessui/react";
import { useCallback, useState } from "react";
import debouncer from "../../utility/debouncer";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

export function GenericSearchBox() {
  const [search, setSearch] = useState("");

  const delayedSearch = useCallback(
    debouncer((value) => onSearchHandler(value), 500),
    []
  );

  function onSearchHandler(value) {
    console.log("🚀 ~ onSearchHandler ~ value:", value);
  }

  function onChangehandler(e) {
    const search = e.target.value;
    console.log("🚀 ~ onChangehandler ~ search:", search);
    setSearch(search);
    delayedSearch(search);
  }

  return (
    <form className="formStyle">
      <div className="w-full px-4">
        <Field>
          <Label className="labelStyle">
            Search from open/resolved/all tickets
          </Label>
          <div className="relative">
          <span className="absolute top-2 left-2 border-r border-gray-300 px-2">
            <MagnifyingGlassIcon className="size-5 text-gray-600" />
          </span>
            <Input
              value={search}
              onChange={onChangehandler}
              className="textFieldStyle !pl-14"
            />
          </div>
        </Field>
      </div>
    </form>
  );
}
