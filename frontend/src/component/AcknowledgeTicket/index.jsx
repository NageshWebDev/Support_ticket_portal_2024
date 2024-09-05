import { Field, Label } from "@headlessui/react";
import { useParams } from "react-router";
import { ArrowLongLeftIcon } from "@heroicons/react/20/solid";
import { NavLink } from "react-router-dom";
import {
  useDeleteUserTicketMutation,
  useGetAllUserTicketsQuery,
  useGetSpecificUserTicketQuery,
  useUpdateUserTicketStatusMutation,
} from "../../store/api/userTicketAPI";
import getStatusClass from "../../util/getStatusClasss";
import GenericListBox from "../Generic/ListBox";
import {
  markAsOptions,
  headings,
  mapHeadings,
  filterIdMap,
  filterName,
} from "../../util/constant";
import { useRef, useMemo } from "react";
import GenericDialogBox from "../Generic/Dialog";
import { Button, DialogTitle } from "@headlessui/react";
import { useSelector } from "react-redux";
import formatDatAndTime from "../../util/formatDate";

export default function AcknowledgeTicket() {
  const userId = useSelector((state) => state.userInfoReducer.userId);
  const { ticketId } = useParams();
  const genericDialogRef = useRef();
  const {
    isLoading: fetchingSpecificTicket,
    data: specificTicketDetails,
    isError: errorOnGettingTicket,
    error: ticketErrorMessage,
  } = useGetSpecificUserTicketQuery({ userId, ticketId });

  // To delete user ticket
  const [deleteUserTicket, { isLoading: isDeleting, isSuccess: isDeleted }] =
    useDeleteUserTicketMutation();

  // To refetch latest user tickets
  const { refetch: refetchAllTickets } = useGetAllUserTicketsQuery(userId);

  const selectedOption = useMemo(() => {
    if (specificTicketDetails) {
      return markAsOptions.find(
        (option) => option.filterId === specificTicketDetails?.data.filterId
      );
    }
    return null;
  }, [specificTicketDetails]);

  const dTitle = useMemo(
    () => (
      <DialogTitle
        as="h3"
        className="dialogTitle data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      >
        Delete Ticket Permanently
      </DialogTitle>
    ),
    []
  );

  const dButton = useMemo(
    () => (
      <div className="flex justify-between w-full gap-10">
        <Button
          className={`!w-32 ${
            isDeleting ? "genericDisablePrimary " : "genericPrimaryBtn"
          }`}
          disabled={isDeleting}
          onClick={() => genericDialogRef.current.close()}
        >
          Close
        </Button>
        <Button
          className={`!w-48 ${
            isDeleting ? "genericDisablePrimary " : "genericCancelBtn"
          }`}
          disabled={isDeleting}
          onClick={onDeleteHandler}
        >
          {isDeleting ? "Deleting Ticket" : "Delete Ticket"}
        </Button>
      </div>
    ),
    [isDeleting, onDeleteHandler]
  );

  const dBody = useMemo(
    () => (
      <div className="font-medium flex flex-col w-full mt-2 m-5 text-gray-700">
        <p className="text-center ">
          Are you sure you want to permanently delete this ticket?
        </p>
        <p className="text-center text-sm my-5">
          <span className="bg-red-100 w-max px-2 py-1 rounded-md border border-red-200 text-red-500">
            *This action cannot be undone.
          </span>
        </p>
      </div>
    ),
    [ticketId]
  );

  async function onDeleteHandler() {
    try {
      await deleteUserTicket({ userId, ticketId }).unwrap();
      genericDialogRef.current.close();
      await refetchAllTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  }

  return (
    <section className="min-h-full">
      <div className="absolute left-0 bg-gray-50 px-3 py-1 rounded-r-full shadow-md">
        <NavLink
          to={-1}
          className="group text-gray-600 hover:text-gray-800 flex items-center gap-1 px-2 text-sm font-medium"
        >
          <ArrowLongLeftIcon className="group-hover:-translate-x-2 size-5 duration-500 transition-all" />
          Back
        </NavLink>
      </div>
      {fetchingSpecificTicket && <LoadingSkeleton />}
      {!isDeleted && specificTicketDetails?.data && (
        <TicketDetails
          ticketId={ticketId}
          specificTicketDetails={specificTicketDetails}
          selectedOption={selectedOption}
          isDeleting={isDeleting}
          genericDialogRef={genericDialogRef}
        />
      )}
      {errorOnGettingTicket && (
        <section className="min-h-[86vh]  flex justify-center items-center">
          <p className="text-center text-gray-500">
            {ticketErrorMessage?.data.message}
          </p>
        </section>
      )}
      {isDeleted && (
        <section className="min-h-[86vh]  flex justify-center items-center">
          <p className="text-center text-gray-500">
            The ticket with ID {ticketId} has been permanently deleted.
          </p>
        </section>
      )}
      <GenericDialogBox
        ref={genericDialogRef}
        dTitle={dTitle}
        dButton={dButton}
        dBody={dBody}
      />
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <section className="formStyle !space-y-5">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-2xl flex gap-2 justify-between items-center">
          Ticket Status :<span className="skeletonTd !h-6 !w-48"></span>
        </h1>
      </div>

      {/* Overview */}
      <section>
        <h1 className="font-medium border-b-2 border-gray-400 pb-3">
          Overview
        </h1>
        <div className="grid grid-cols-1 divide-y-2">
          {headings.map((heading) => (
            <div className="grid grid-cols-3 p-5 py-4 text-sm" key={heading}>
              <p className="font-medium col-span-1 capitalize flex items-center">
                {mapHeadings[heading]}
              </p>
              <p className="col-span-2 tracking-wide flex items-center">
                <span className="skeletonTd !w-32"></span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Management */}
      <section>
        <h1 className="font-medium border-b-2 border-gray-400 pb-3">
          Management
        </h1>
        <div className="grid grid-cols-1 divide-y-2">
          <div className="grid grid-cols-3 p-5 text-sm">
            <p className="font-medium col-span-1 capitalize flex items-center">
              Mark ticket as
            </p>
            <div className="col-span-2 grid grid-cols-2">
              <span className="skeletonTd !h-8 !w-96 flex items-center"></span>

              <div className="flex justify-end">
                <button type="submit" className="!w-48 genericDisablePrimary">
                  Update Ticket Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delete ticket */}
      <section>
        <h1 className="font-medium border-b-2 border-gray-400 pb-3">
          Delete Ticket
        </h1>
        <div className="text-sm p-5 flex justify-between items-center">
          <p className="font-medium text-gray-400">
            Once ticket is deleted, they can't be retrieved back.
          </p>
          <button className="genericDisablePrimary !w-48">
            Proceed To Delete
          </button>
        </div>
      </section>
    </section>
  );
}

function TicketDetails({
  ticketId,
  specificTicketDetails,
  selectedOption,
  genericDialogRef,
}) {
  const formRef = useRef();
  const userId = useSelector((state) => state.userInfoReducer.userId);

  let specificTicketDetailsData = specificTicketDetails?.data;
  const status = specificTicketDetailsData?.status;
  if (status === "Open") {
    console.log("status : ", status);
  }

  const updatedTicketDetails = {
    ...specificTicketDetailsData,
    createdAt: formatDatAndTime(specificTicketDetailsData.createdAt),
    updatedAt: formatDatAndTime(specificTicketDetailsData.updatedAt),
  };

  // To update status of user ticket
  const [updateUserTicketStatus, { isLoading: isUpdatingTicket }] =
    useUpdateUserTicketStatusMutation();

  // To refetch latest user tickets
  const { refetch: refetchAllTickets } = useGetAllUserTicketsQuery(userId);

  async function onSubmitHandler(e) {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const filterId = filterIdMap[formData.get("status")];
    try {
      await updateUserTicketStatus({
        userId,
        ticketId,
        updatedStatus: { filterId },
      });
      // Manually refetch the data
      await refetchAllTickets();
    } catch (error) {}
  }

  return (
    <section className="formStyle !space-y-5">
      <div className="flex w-full">
        <h1 className="text-2xl flex gap-2 justify-between items-center">
          Ticket Status :
          <span
            className={`text-2xl ${getStatusClass(
              updatedTicketDetails?.status
            )}`}
          >
            {filterName[updatedTicketDetails?.status]}
          </span>
        </h1>

        {/* <div>
          <Field>
            <Label className="labelStyle">Assigned To</Label>
            <div className="mt-3">
              <GenericListBox
                name="userId"
                options={userList}
                selectedOption={userList[0]}
              />
            </div>
          </Field>
        </div> */}
      </div>
      {/* Overview */}
      <section>
        <h1 className="font-medium border-b-2 border-gray-400 pb-3">
          Overview
        </h1>
        <div className="grid grid-cols-1 divide-y-2">
          {headings.map((heading) => (
            <div className="grid grid-cols-3 p-5 text-sm" key={heading}>
              <p className="font-medium col-span-1 capitalize flex items-center">
                {mapHeadings[heading]}
              </p>
              <p className="col-span-2 tracking-wide flex items-center capitalize">
                {updatedTicketDetails[heading]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Management */}
      <section>
        <h1 className="font-medium border-b-2 border-gray-400 pb-3">
          Management
        </h1>
        <div className="grid grid-cols-1 divide-y-2">
          <div className="grid grid-cols-3 p-5 text-sm">
            <p className="font-medium col-span-1 capitalize flex items-center">
              Mark ticket as
            </p>
            <form
              ref={formRef}
              onSubmit={onSubmitHandler}
              className="col-span-2 grid grid-cols-2"
            >
              <GenericListBox
                name="status"
                className="col-span-1"
                options={markAsOptions}
                selectedOption={selectedOption}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className={`!w-48 ${
                    isUpdatingTicket
                      ? "genericDisablePrimary"
                      : "genericPrimaryBtn"
                  }`}
                >
                  {isUpdatingTicket
                    ? "Updating Ticket Status"
                    : "Update Ticket Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* Delete ticket */}
      <section>
        <h1 className="font-medium border-b-2 border-gray-400 pb-3">
          Delete Ticket
        </h1>
        <div className="text-sm p-5 flex justify-between items-center">
          <p className="font-medium text-red-500">
            Once ticket is deleted, it can't be retrieved back.
          </p>
          <button
            disabled={isUpdatingTicket}
            onClick={() => genericDialogRef.current.open()}
            className={`!w-48 ${
              isUpdatingTicket ? "genericDisablePrimary" : "genericCancelBtn"
            }`}
          >
            Proceed To Delete
          </button>
        </div>
      </section>
    </section>
  );
}
