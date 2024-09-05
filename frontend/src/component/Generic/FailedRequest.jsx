import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, forwardRef, useImperativeHandle } from "react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/16/solid";

const GenericFailedRequest = forwardRef(({ errorMsg }, ref) => {
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
            className="gap-5 relative flex flex-col justify-center items-center w-full max-w-2xl h-[250px] shadow-xl rounded-xl bg-gray-50 p-6  duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <XMarkIcon
              onClick={close}
              className="absolute size-6 top-5 right-5 text-gray-500 cursor-pointer hover:text-gray-800 "
            />
            <DialogTitle
              as="h3"
              className="text-xl font-medium text-red-600 flex items-center gap-2"
            >
              <ExclamationTriangleIcon className="size-6" />
              Request Failed
            </DialogTitle>
            <div className="font-medium flex flex-col justify-center items-center gap-5 mt-5 text-gray-600">
              <p>{errorMsg}</p>
              {/* <p className="mt-2 text-sm/6 text-white">
              Once completed, you will receive a confirmation email with the
              details of your request.
            </p> */}
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

GenericFailedRequest.displayName = "GenericFailedRequest";
export default GenericFailedRequest;
