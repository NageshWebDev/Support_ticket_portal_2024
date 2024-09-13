import { useParams } from "react-router";
import {
  useDeleteUserTicketMutation,
  useGetAdminEmailAndIdListQuery,
  useGetAllUserTicketsQuery,
  useGetSpecificUserTicketQuery,
  useUpdateUserTicketAssigneeMutation,
  useUpdateUserTicketStatusMutation,
} from "../../store/api/userTicketAPI";
import getStatusClass from "../../util/getStatusClass";
import GenericListBox from "../Generic/ListBox";
import {
  markAsOptions,
  headings,
  mapHeadings,
  filterIdMap,
  filterName,
} from "../../util/constant";
import { useRef, useMemo, useState, useEffect, useCallback } from "react";
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
  const { refetch: refetchAllTickets } = useGetAllUserTicketsQuery({ userId });

  const onDeleteHandler = useCallback(async () => {
    try {
      await deleteUserTicket({ userId, ticketId }).unwrap();
      genericDialogRef.current.close();
      await refetchAllTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  }, [deleteUserTicket, refetchAllTickets, ticketId, userId]);

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
    []
  );

  return (
    <section className="w-full h-full">
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
  const userRole = useSelector((state) => state.userInfoReducer.userRole);

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

        {userRole === "SUPER_ADMIN" && (
          <div className="grid grid-cols-1 divide-y-2">
            <div className="grid grid-cols-3 p-5 text-sm">
              <p className="font-medium col-span-1 capitalize flex items-center">
                Assign Ticket To
              </p>
              <div className="col-span-2 grid grid-cols-2">
                <span className="skeletonTd !h-8 !w-96 flex items-center"></span>

                <div className="flex justify-end">
                  <button type="submit" className="!w-48 genericDisablePrimary">
                    Update Ticket Assignee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
      {userRole === "SUPER_ADMIN" && (
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
      )}
    </section>
  );
}

function TicketDetails({
  ticketId,
  specificTicketDetails,
  selectedOption,
  genericDialogRef,
}) {
  const specificTicketDetailsData = specificTicketDetails?.data;
  const formRefUpdateStatus = useRef();
  const formRefUpdateAssignee = useRef();
  const userId = useSelector((state) => state.userInfoReducer.userId);
  const userRole = useSelector((state) => state.userInfoReducer.userRole);

  const [adminList, setAdminList] = useState([]);

  const { data: adminListData, isLoading: fetchingAdminList } =
    useGetAdminEmailAndIdListQuery({ userId });

  useEffect(() => {
    if (!fetchingAdminList) {
      //get Admin Email And Id List
      const data = adminListData?.data.map((detail) => ({
        name: detail.name,
        id: detail._id,
      })).sort((adminOne, adminTwo) => adminOne.name.localeCompare(adminTwo.name)) ;
      setAdminList(data)
    }
  }, [fetchingAdminList, adminListData]);

  const updatedTicketDetails = {
    ...specificTicketDetailsData,
    createdAt: formatDatAndTime(specificTicketDetailsData.createdAt),
    updatedAt: formatDatAndTime(specificTicketDetailsData.updatedAt),
  };
  let assigneeDetails;
  if (updatedTicketDetails?.assigneeDetails) {
    assigneeDetails = adminList.find(
      (admin) => admin.id === updatedTicketDetails?.assigneeDetails._id
    );
  }

  // To update status of user ticket
  const [updateUserTicketStatus, { isLoading: isUpdatingTicket }] =
    useUpdateUserTicketStatusMutation();

  // To update assignee of user ticket
  const [updateUserTicketAssignee, { isLoading: isUpdatingAssignee }] =
    useUpdateUserTicketAssigneeMutation();

  // To refetch latest user tickets
  const { refetch: refetchAllTickets } = useGetAllUserTicketsQuery({ userId });

  async function onUpdateStatusHandler(e) {
    e.preventDefault();
    const formData = new FormData(formRefUpdateStatus.current);
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

  async function onUpdateAssigneeHandler(e) {
    e.preventDefault();
    const formData = new FormData(formRefUpdateAssignee.current);
    const assigneeId = formData.get("assignee");
    try {
      await updateUserTicketAssignee({
        userId,
        ticketId,
        assigneeId: { assigneeId },
      });
      // Manually refetch the data
      await refetchAllTickets();
    } catch (error) {}
  }

  return (
    <section className="formStyle !space-y-5">
      <div className="flex justify-between w-full">
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

        {userRole === "SUPER_ADMIN" && (
          <div className="grid grid-cols-1 divide-y-2">
            <div className="grid grid-cols-3 p-5 text-sm">
              <p className="font-medium col-span-1 capitalize flex items-center">
                Assign Ticket To
              </p>
              <form
                ref={formRefUpdateAssignee}
                onSubmit={onUpdateAssigneeHandler}
                className="col-span-2 grid grid-cols-2"
              >
                <GenericListBox
                  name="assignee"
                  className="col-span-1"
                  options={adminList}
                  selectedOption={assigneeDetails}
                  disabled={fetchingAdminList}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`!w-52 ${
                      isUpdatingAssignee || isUpdatingTicket
                        ? "genericDisablePrimary"
                        : "genericPrimaryBtn"
                    }`}
                  >
                    {isUpdatingAssignee || isUpdatingTicket
                      ? "Updating Ticket Assignee"
                      : "Update Ticket Assignee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 divide-y-2">
          <div className="grid grid-cols-3 p-5 text-sm">
            <p className="font-medium col-span-1 capitalize flex items-center">
              Mark ticket as
            </p>
            <form
              ref={formRefUpdateStatus}
              onSubmit={onUpdateStatusHandler}
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
                  className={`!w-52 ${
                    isUpdatingTicket || isUpdatingAssignee
                      ? "genericDisablePrimary"
                      : "genericPrimaryBtn"
                  }`}
                >
                  {isUpdatingTicket || isUpdatingAssignee
                    ? "Updating Ticket Status"
                    : "Update Ticket Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Delete ticket */}
      {userRole === "SUPER_ADMIN" && (
        <section>
          <h1 className="font-medium border-b-2 border-gray-400 pb-3">
            Delete Ticket
          </h1>
          <div className="text-sm p-5 flex justify-between items-center">
            <p className="font-medium text-red-500">
              Once ticket is deleted, it can't be retrieved back.
            </p>
            <button
              disabled={isUpdatingTicket || isUpdatingAssignee}
              onClick={() => genericDialogRef.current.open()}
              className={`!w-52 ${
                isUpdatingTicket || isUpdatingAssignee
                  ? "genericDisablePrimary"
                  : "genericCancelBtn"
              }`}
            >
              Proceed To Delete
            </button>
          </div>
        </section>
      )}
    </section>
  );
}
