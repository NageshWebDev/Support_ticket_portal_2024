import {
  Description,
  Field,
  Input,
  Label,
  Button,
  Textarea,
} from "@headlessui/react";
import { useRef } from "react";
import GenericListBox from "../Generic/ListBox";
import GenericLoading from "../Generic/Loading";

const priorityOptions = [
  { id: "low", name: "Low" },
  { id: "high", name: "High" },
  { id: "urgent", name: "Urgent" },
  { id: "immediate", name: "Immediate" },
];

const categoryOptions = [
  { id: "manageAccount", name: "Manage Account" },
  { id: "manageSoftware", name: "Manage Software" },
  { id: "security", name: "Security" },
];

export function A() {
  const dialogRef = useRef();

  const handleOpenDialog = () => {
    dialogRef.current.open();

    setTimeout(() => handleCloseDialog(), 2000);
  };

  const handleCloseDialog = () => {
    dialogRef.current.close();
  };

  return (
    <section className=" flex justify-center items-center  h-full">
      <form className="formStyle">
        <div className="w-full px-4">
          <Field>
            <Label className="labelStyle">Title</Label>
            <Description className="descriptionStyle">
              Provide a brief and clear title for the ticket.
            </Description>
            <Input placeholder="Type title" className="textFieldStyle" />
          </Field>
        </div>

        <div className="w-full  px-4">
          <Field>
            <Label className="labelStyle">Description</Label>
            <Description className="descriptionStyle">
              Elaboate the issue or request in the ticket.
            </Description>
            <Textarea
              placeholder="Type description"
              className="textAreaStyle"
              rows={3}
            />
          </Field>
        </div>

        <div className="flex">
          <div className="w-full px-4">
            <Field>
              <Label className="labelStyle">Category</Label>
              <Description className="descriptionStyle">
                Set the priority level and use your real name for accurate
                tracking.
              </Description>
              <div className="mt-3">
                <GenericListBox options={categoryOptions} />
              </div>
            </Field>
          </div>

          <div className="w-full px-4">
            <Field>
              <Label className="labelStyle">Priority</Label>
              <Description className="descriptionStyle">
                Set the priority level and use your real name for accurate
                tracking.
              </Description>
              <div className="mt-3">
                <GenericListBox options={priorityOptions} />
              </div>
            </Field>
          </div>
        </div>

        <div className="flex">
          <div className="w-full px-4">
            <Field>
              <Label className="labelStyle">Add File</Label>
              <Description className="descriptionStyle">
                Set the priority level and use your real name for accurate
                tracking.
              </Description>
              <Input placeholder="Type full name" className="textFieldStyle" />
            </Field>
          </div>

          <div className="w-full  px-4">
            <Field>
              <Label className="labelStyle">Created By</Label>
              <Description className="descriptionStyle">
                Use your real name to ensure the ticket is properly attributed.
              </Description>
              <Input placeholder="Type full name" className="textFieldStyle" />
            </Field>
          </div>
        </div>
        <div className="w-full flex justify-end px-4">
          <Button
            onClick={handleOpenDialog}
            className="rounded-md bg-[#444] hover:bg-[#333] tracking-wider active:scale-90 transition-all py-1.5 px-3 text-sm/6 font-semibold text-white "
          >
            Raise Ticket
          </Button>
        </div>
      </form>

      <GenericLoading ref={dialogRef} />
    </section>
  );
}
