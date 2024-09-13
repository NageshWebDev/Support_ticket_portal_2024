import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllUserTicketsQuery } from "../../store/api/userTicketAPI";
import { setTicketData } from "../../store/feature/ticketSlice";
import GenericFilter from "../Generic/Filter";
import { GenericSearchBox } from "../Generic/SearchBox";
import TableSkeleton from "../Generic/TableSkeleton";
import { TableWithPagination } from "../Generic/TableWithPagination";
import { categoryOptions, filterName, filterOptions } from "../../util/constant";
import { useSearchParams } from "react-router-dom";
import formatDatAndTime from "../../util/formatDate";
import getStatusClass from "../../util/getStatusClass";
import setExclamationMark from "../../util/setExclamationMark";
import getPriorityClass from "../../util/getPriorityClass"
import getAssignedClass from "../../util/getAssignedClass"

const tableHeading = [
  "Sn.No.",
  "Title",
  "Category",
  "Urgency",
  "Created at",
  "Status",
  "Ticket Assigned",
];

export function B() {
  const userId = useSelector((state) => state.userInfoReducer.userId);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(filterOptions[0]);
  const { isLoading, data } = useGetAllUserTicketsQuery({userId});
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");

    if (!isLoading && status) {
      const idx = filterOptions.findIndex((option) => option.id === status);
      if (idx !== -1) {
        setSelected(filterOptions[idx]);
      }
    }
  }, [searchParams, isLoading]);

  useEffect(() => {
    if (!isLoading && data) dispatch(setTicketData(data.data));
  }, [isLoading, data, dispatch]);

  const tableRowData = useSelector((state) => state.ticketReducer.ticketData).map(data=>{
    const { ticketId, title, category, priority, createdAt, status, assigneeDetails } = data
      const assigned = assigneeDetails ? "Assigned" : "Not Assigned"

    
    return {
      id: ticketId,
      href: `/ticket/view/${ticketId}`,
      title,
      category: categoryOptions.find((option) => option.id === category).name,
      priority:`${priority} ${setExclamationMark(priority)} CSS_CLASS ${getPriorityClass(priority)}`,
      createdAt: formatDatAndTime(createdAt),
      status: `${filterName[status]} CSS_CLASS ${getStatusClass(status)}`,
      assigned: `${assigned} CSS_CLASS ${getAssignedClass(assigned)}`
      }
  })

  return (
    <section className="space-y-5 w-full">
      <h1 className="mb-5 pb-3 font-medium border-b text-2xl border-gray-300">
        View Tickets
      </h1>
      <GenericSearchBox disabled={isLoading} />
      <div className="pt-10">
        <div className="flex justify-end items-center ">
          <div className="flex justify-center items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-800">
              Filter by status :
            </span>
            <GenericFilter
              options={filterOptions}
              disabled={isLoading}
              selectedOption={selected}
            />
          </div>
        </div>
        {isLoading ? <TableSkeleton /> : <TableWithPagination tableHeading={tableHeading} tableRowData={tableRowData}/>}
      </div>
    </section>
  );
}
