import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, forwardRef, useImperativeHandle } from "react";
import { ArrowPathIcon } from "@heroicons/react/16/solid";

const GenericLoading = forwardRef(({ heading }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none "
      onClose={() => {}}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/50 backdrop-blur">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="dialogPanel data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="dialogTitle">
              <ArrowPathIcon className="w-6 h-6 animate-spin" />
              {heading}
            </DialogTitle>
            <div className="font-medium flex flex-col justify-center items-center mt-5 text-gray-800">
              <p> We're currently processing your request. </p>
              <p>Thank you for your patience!</p>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
});

/*
  Exporting an arrow function directly doesn't give the component a displayName,
  but if you export a regular function the function name will be used as displayName.

  It is mainly used by the Developer Tools to give a name to the components you use.
  If a component doesn't have a displayName is will be shown as <Unknown />
*/

GenericLoading.displayName = "GenericLoading";
export default GenericLoading;
