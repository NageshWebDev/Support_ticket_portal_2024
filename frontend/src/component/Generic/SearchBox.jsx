import { Field, Input, Label } from "@headlessui/react";
import { useCallback, useState } from "react";
import debouncer from "../../util/debouncer";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useDispatch, useSelector } from "react-redux";
import { searchTicketData } from "../../store/feature/ticketSlice";

export function GenericSearchBox({ disabled }) {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const context = useSelector((state) =>
    state.ticketReducer.filterId.toLowerCase()
  );

  const delayedSearch = useCallback(
    debouncer((value) => onSearchHandler(value), 500),
    []
  );

  function onSearchHandler(value) {
    dispatch(searchTicketData(value));
  }

  function onChangehandler(e) {
    const search = e.target.value;
    setSearch(search);
    delayedSearch(search);
  }

  return (
    <form className="formStyle">
      <div className="w-full px-4">
        <Field>
          <Label className="labelStyle">Search from {context} tickets</Label>
          <div className="relative">
            <span className="absolute top-2 left-2 border-r border-gray-300 px-2">
              <MagnifyingGlassIcon className="size-5 text-gray-600" />
            </span>
            <Input
              value={search}
              onChange={onChangehandler}
              className={`textFieldStyle !pl-14 ${
                disabled ? "cursor-not-allowed" : ""
              }`}
              disabled={disabled}
              placeholder="search on the bases of title, category and urgency"
            />
          </div>
        </Field>
      </div>
    </form>
  );
}
