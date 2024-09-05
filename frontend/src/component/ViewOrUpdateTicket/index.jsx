import {
  Description,
  Field,
  Input,
  Label,
  Button,
  Textarea,
} from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import {
  useGetAllUserTicketsQuery,
  useGetSpecificUserTicketQuery,
  useUpdateUserTicketMutation,
} from "../../store/api/userTicketAPI";

import GenericListBox from "../Generic/ListBox";
import GenericSwitch from "../Generic/Switch";
import getStatusClass from "../../util/getStatusClasss";
import GenericLoading from "../Generic/Loading";
import { categoryOptions, priorityOptions } from "../../util/constant";
import { useSelector } from "react-redux";

export function ViewOrupdateUserTicket() {
  const formRef = useRef();
  const dialogRef = useRef();
  const userId = useSelector((state) => state.userInfoReducer.userId);
  const { ticketId } = useParams();
  const [isEditable, setIsEditable] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [priority, setPriority] = useState(priorityOptions[0]);
  const [status, setStatus] = useState("Loading Ticket Status");

  // To update user ticket
  const [updateUserTicket, { isLoading: isUpdating }] =
    useUpdateUserTicketMutation();

  // To get details of user ticket
  const { isLoading: fetchingSpecificTicket, data: specificTicketDetails } =
    useGetSpecificUserTicketQuery({ userId, ticketId });

  // To refetch latest user tickets
  // const { refetch: refetchAllTickets } = useGetAllUserTicketsQuery(userId);

  useEffect(() => {
    if (specificTicketDetails) {
      const { title, description, category, priority, status } =
        specificTicketDetails?.data;
      setTitle(title);
      setDescription(description);
      setCategory(() =>
        categoryOptions.find((option) => option.id === category)
      );
      setPriority(() =>
        priorityOptions.find((option) => option.id === priority)
      );
      setStatus(status);
    }
  }, [specificTicketDetails]);

  useEffect(() => {
    if (isUpdating) dialogRef.current.open();
    else dialogRef.current.close();
  }, [isUpdating]);

  async function onSubmitHandler(e) {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    try {
      await updateUserTicket({ userId, ticketId, updatedTicket: formData });
      // Manually refetch the data
      await refetchAllTickets();
    } catch (error) {
      console.error(error);
    }
  }

  function isDisabled() {
    return fetchingSpecificTicket || !isEditable;
  }

  return (
    <section className="flex flex-col justify-center items-center">
      <form ref={formRef} onSubmit={onSubmitHandler} className="formStyle">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-gray-700">
              Ticket Status
            </span>
            <span>:</span>
            <span className={`text-sm font-medium ${getStatusClass(status)}`}>
              {status}
            </span>
          </div>
          <div className="group relative">
            <Field disabled={fetchingSpecificTicket || status != "Open"}>
              <GenericSwitch
                leftText="view"
                rightText="update"
                onToggle={(value) => setIsEditable(value)}
                disabled={fetchingSpecificTicket || status != "Open"}
              />
            </Field>
            <div className="absolute invisible opacity-0 transition-opacity duration-500 ease-in-out w-max border rounded-md p-2 shadow border-sky-200 bg-sky-100 text-xs text-gray-500 mt-1 group-hover:visible group-hover:opacity-100">
              *Updates are only allowed when the ticket status is open.
            </div>
          </div>
        </div>

        <div className="w-full  px-4">
          <Field disabled={isDisabled()}>
            <Label className="labelStyle">Title</Label>
            <Description className="descriptionStyle">
              Provide a brief and clear title for the ticket.
            </Description>
            <Input
              name="title"
              placeholder="Type title"
              className={`textFieldStyle ${
                fetchingSpecificTicket ? "animate-pulse" : "animate-none"
              }`}
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </Field>
        </div>

        <div className="w-full  px-4">
          <Field disabled={isDisabled()}>
            <Label className="labelStyle">Description</Label>
            <Description className="descriptionStyle">
              Elaboate the issue or request in the ticket.
            </Description>
            <Textarea
              name="description"
              placeholder="Type description"
              className={`textAreaStyle ${
                fetchingSpecificTicket ? "!animate-pulse" : "!animate-none"
              }`}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </div>

        <div className="flex">
          <div className="w-full px-4">
            <Field disabled={isDisabled()}>
              <Label className="labelStyle">Category</Label>
              <Description className="descriptionStyle">
                Set the priority level and use your real name for accurate
                tracking.
              </Description>
              <div className="mt-3">
                <GenericListBox
                  name="category"
                  options={categoryOptions}
                  selectedOption={category}
                  disabled={isDisabled()}
                  loading={fetchingSpecificTicket}
                />
              </div>
            </Field>
          </div>

          <div className="w-full px-4">
            <Field disabled={isDisabled()}>
              <Label className="labelStyle">Priority</Label>
              <Description className="descriptionStyle">
                Set the priority level and use your real name for accurate
                tracking.
              </Description>
              <div className="mt-3">
                <GenericListBox
                  name="priority"
                  options={priorityOptions}
                  selectedOption={priority}
                  disabled={isDisabled()}
                  loading={fetchingSpecificTicket}
                />
              </div>
            </Field>
          </div>
        </div>

        <div className="flex">
          <div className="w-full px-4">
            <Field disabled={isDisabled()}>
              <Label className="labelStyle">Add File</Label>
              <Description className="descriptionStyle">
                Set the priority level and use your real name for accurate
                tracking.
              </Description>
              <Input
                name="file"
                placeholder="Type full name"
                className={`textFieldStyle ${
                  fetchingSpecificTicket ? "animate-pulse" : "animate-none"
                }`}
              />
            </Field>
          </div>
        </div>

        <div
          className={`w-full flex justify-end px-4 ${
            isEditable ? "visible" : "invisible"
          }`}
        >
          <Button type="submit" className="genericPrimaryBtn">
            Update Ticket
          </Button>
        </div>
      </form>

      <GenericLoading ref={dialogRef} heading="Updating Your Ticket" />
    </section>
  );
}
