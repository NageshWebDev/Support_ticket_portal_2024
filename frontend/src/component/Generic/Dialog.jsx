import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useState, forwardRef, useImperativeHandle } from "react";

const GenericDialogBox = forwardRef(({ dTitle, dButton, dBody }, ref) => {
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
            {dTitle && dTitle}
            {dBody && dBody}
            <div className="mt-4">{dButton && dButton}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
});

export default GenericDialogBox;
