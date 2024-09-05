import { Switch } from "@headlessui/react";
import { useState } from "react";

export default function GenericSwitch({
  leftText,
  rightText,
  onToggle,
  disabled = false,
}) {
  const [enabled, setEnabled] = useState(false);

  function onChangeHandler() {
    setEnabled((prevVal) => {
      onToggle(!prevVal);
      return !prevVal;
    });
  }

  return (
    <div className="flex gap-2 items-center capitalize">
      <span className={`text-sm font-medium ${disabled && "text-gray-400"}`}>
        {leftText}
      </span>
      <Switch
        checked={enabled}
        onChange={onChangeHandler}
        className="group inline-flex h-4 w-10 items-center rounded-full bg-gray-300 transition data-[checked]:bg-[#555]"
      >
        <span className="size-3 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
      </Switch>
      <span className={`text-sm font-medium ${disabled && "text-gray-400"}`}>
        {rightText}
      </span>
    </div>
  );
}
