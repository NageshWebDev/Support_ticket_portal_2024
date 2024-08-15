import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, forwardRef, useImperativeHandle } from "react";
import { ArrowPathIcon } from "@heroicons/react/16/solid";

const GenericLoading = forwardRef((props, ref) => {
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
            className="flex flex-col justify-center items-center w-full max-w-2xl h-[250px] shadow-xl border border-[#555] rounded-xl bg-gray-50 p-6  duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle
              as="h3"
              className="text-center text-xl font-medium text-gray-800 flex items-center gap-2"
            >
              <ArrowPathIcon className="w-6 h-6 animate-spin" />
              Creating Your Ticket
            </DialogTitle>
            <div className="font-medium flex flex-col justify-center items-center mt-5 text-gray-800">
              <p>
                We're currently processing your request. This may take a few
                moments.
              </p>
              {/* <p className="mt-2 text-sm/6 text-white">
              Once completed, you will receive a confirmation email with the
              details of your request.
            </p> */}
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

GenericLoading.displayName = 'GenericLoading';
export default GenericLoading;
