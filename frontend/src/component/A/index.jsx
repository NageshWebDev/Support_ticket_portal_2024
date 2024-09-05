import {
  Description,
  Field,
  Input,
  Label,
  Button,
  Textarea,
} from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import {
  useCreateUserTicketMutation,
  useGetUsersEmailAndIdListQuery,
} from "../../store/api/userTicketAPI";
import GenericFailedRequest from "../Generic/FailedRequest";
import GenericListBox from "../Generic/ListBox";
import GenericLoading from "../Generic/Loading";
import TicketSubmitted from "../Generic/TicketSubmitted";
import { priorityOptions, categoryOptions } from "../../util/constant";
import { useSelector } from "react-redux";

export function A() {
  const userId = useSelector((state) => state.userInfoReducer.userId);
  const userRole = useSelector((state) => state.userInfoReducer.userRole);
  const [userList, setUserList] = useState([]);

  const { data: fetchedData } = useGetUsersEmailAndIdListQuery(
    { userId },
    {
      skip: userRole !== "admin",
    }
  );

  const dialogRef = useRef();
  const dialogFailedReqRef = useRef();
  const [createUserTicket, { isLoading, isSuccess }] =
    useCreateUserTicketMutation();
  const formRef = useRef();

  useEffect(() => {
    if (fetchedData?.data) {
      const tempUserList = fetchedData?.data.map((user) => ({
        id: user._id,
        name: user.email,
      }));
      setUserList(tempUserList);
    }
  }, [fetchedData]);

  useEffect(() => {
    if (isLoading) dialogRef.current.open();
    else dialogRef.current.close();
  }, [isLoading]);

  async function onSubmitHandler(e) {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      await createUserTicket({ userId, newTicket: formData });
    } catch (error) {
      console.error("Failed to create the ticket", error);
    }
  }

  return (
    <section className="h-full">
      <h1 className="my-5 font-medium border-b text-2xl border-gray-300 pb-3">
        Create Ticket
      </h1>
      <form ref={formRef} onSubmit={onSubmitHandler} className="formStyle">
        <div className="w-full px-4">
          <Field>
            <Label className="labelStyle">Title</Label>
            <Description className="descriptionStyle">
              Provide a brief and clear title for the ticket.
            </Description>
            <Input
              placeholder="Type title"
              name="title"
              className="textFieldStyle"
              required
            />
          </Field>
        </div>

        <div className="w-full  px-4">
          <Field>
            <Label className="labelStyle">Description</Label>
            <Description className="descriptionStyle">
              Elaboate the issue or request in the ticket.
            </Description>
            <Textarea
              name="description"
              placeholder="Type description"
              className="textAreaStyle"
              rows={3}
              required
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
                <GenericListBox
                  name="category"
                  options={categoryOptions}
                  selectedOption={categoryOptions[0]}
                />
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
                <GenericListBox
                  name="priority"
                  options={priorityOptions}
                  selectedOption={priorityOptions[0]}
                />
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
              <Input
                name="file"
                placeholder="Type full name"
                className="textFieldStyle"
              />
            </Field>
          </div>

          <div className="w-full px-4">
            <Field>
              <Label className="labelStyle">Create Ticket For</Label>
              <Description className="descriptionStyle">
                Set the priority level and use your real name for accurate
                tracking.
              </Description>
              <div className="mt-3">
                <GenericListBox
                  name="userId"
                  options={userList}
                  selectedOption={userList[0]}
                />
              </div>
            </Field>
          </div>
        </div>

        <div className="w-full flex justify-end px-4">
          <Button type="submit" className="genericPrimaryBtn">
            Raise Ticket
          </Button>
        </div>
      </form>

      <GenericLoading ref={dialogRef} heading="Creating Your Ticket" />
      <GenericFailedRequest
        ref={dialogFailedReqRef}
        errorMsg="something went wrong"
      />
      {isSuccess && <TicketSubmitted />}
    </section>
  );
}
