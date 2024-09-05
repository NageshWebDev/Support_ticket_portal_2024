import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, forwardRef, useImperativeHandle } from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/16/solid";
import { NavLink } from "react-router-dom";

export default function TicketSubmitted({ errorMsg }) {
  const [open, setOpen] = useState(true);
  return (
    <Dialog
      open={open}
      as="div"
      className="relative z-10 focus:outline-none "
      onClose={() => {}}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/50 backdrop-blur">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="gap-5 flex flex-col justify-center items-center w-full max-w-2xl h-[250px] shadow-xl rounded-xl bg-gray-50 p-6  duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle
              as="h3"
              className="text-xl font-medium text-gray-600 flex items-center gap-2"
            >
              <ClipboardDocumentCheckIcon className="size-6" />
              Ticket successfully created
            </DialogTitle>
            <div className="font-medium flex justify-between items-center gap-20 mt-5 text-gray-600">
              <NavLink className="genericTertinaryBtn" to="/">
                Home
              </NavLink>
              <NavLink className="genericPrimaryBtn" to="/ticket/view">
                View Tickets
              </NavLink>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
