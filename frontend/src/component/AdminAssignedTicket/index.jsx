import { useParams } from "react-router";
import {
  useGetAssignedTicketsQuery,
  useGetUserProfileQuery,
} from "../../store/api/userTicketAPI";
import { useEffect, useMemo, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import TableSkeleton from "../Generic/TableSkeleton";
import { TableWithPagination } from "../Generic/TableWithPagination";
import { categoryOptions, filterName } from "../../util/constant";
import getStatusClass from "../../util/getStatusClass";
import setExclamationMark from "../../util/setExclamationMark";
import getPriorityClass from "../../util/getPriorityClass";
import getAssignedClass from "../../util/getAssignedClass";
import formatDatAndTime from "../../util/formatDate";

const tableHeading = [
  "Sn.No.",
  "Title",
  "Category",
  "Urgency",
  "Created at",
  "Status",
  "Ticket Assigned",
];

export default function AdminAssignedTicket() {
  const param = useParams();
  const [totalAssignedTickets, setTotalAssignedTickets] = useState(0);
  const [userRec, setUserRec] = useState({ userName: "", userEmail: "" });
  const [tableRowData, setTableRowData] = useState([]);
  const [progressBarDetails, setProgressBarDetails] = useState([
    {
      count: 0,
      percentage: 0,
      pathColor: "rgb(255,83,73)",
      hexCode: "#FF5349",
      label: "Open",
      query: "open",
    },
    {
      count: 0,
      percentage: 0,
      pathColor: "rgb(255,191,0)",
      hexCode: "#FFBF00",
      label: "In-Process",
      query: "inProcess",
    },
    {
      count: 0,
      percentage: 0,
      pathColor: "rgb(41,171,135)",
      hexCode: "#29AB87",
      label: "Resolved",
      query: "resolved",
    },
  ]);
  const { adminId: userId } = param;
  const { isLoading: fetchingAssignedTicket, data: assignedTickets } =
    useGetAssignedTicketsQuery({ userId });

  const { isLoading: fetchingUserProfile, data: userProfile } =
    useGetUserProfileQuery({ userId });

  useEffect(() => {
    if (!fetchingUserProfile && userProfile) {
      if (userProfile?.data) {
        const { name, email } = userProfile.data;
        setUserRec((preVal) => ({
          ...preVal,
          name,
          email,
        }));
      }
    }
  }, [fetchingUserProfile, userProfile]);

  useEffect(() => {
    if (!fetchingAssignedTicket && assignedTickets) {
      const ticketsOverview = {
        OPEN: 0,
        INPROCESS: 0,
        RESOLVED: 0,
      };

      assignedTickets?.data.forEach(
        (ticket) => (ticketsOverview[ticket.filterId] += 1)
      );
      const { OPEN, INPROCESS, RESOLVED } = ticketsOverview;
      const totalTicketCount = OPEN + INPROCESS + RESOLVED;
      setTotalAssignedTickets(totalTicketCount);
      setProgressBarDetails((preVal) => [
        {
          ...preVal[0],
          count: OPEN,
          percentage: Math.floor((OPEN / totalTicketCount) * 100),
        },
        {
          ...preVal[1],
          count: INPROCESS,
          percentage: Math.floor((INPROCESS / totalTicketCount) * 100),
        },
        {
          ...preVal[2],
          count: RESOLVED,
          percentage: Math.floor((RESOLVED / totalTicketCount) * 100),
        },
      ]);

      const tableRowData = assignedTickets?.data.map((data) => {
        const {
          _id: ticketId,
          title,
          category,
          priority,
          createdAt,
          status,
          assigneeDetails,
        } = data;
        const assigned = assigneeDetails ? "Assigned" : "Not Assigned";

        return {
          id: ticketId,
          href: `/ticket/view/${ticketId}`,
          title,
          category: categoryOptions.find((option) => option.id === category)
            .name,
          priority: `${priority} ${setExclamationMark(
            priority
          )} CSS_CLASS ${getPriorityClass(priority)}`,
          createdAt: formatDatAndTime(createdAt),
          status: `${filterName[status]} CSS_CLASS ${getStatusClass(status)}`,
          assigned: `${assigned} CSS_CLASS ${getAssignedClass(assigned)}`,
        };
      });

      setTableRowData(tableRowData);
    }
  }, [fetchingAssignedTicket, assignedTickets]);

  const progressBarDetailsComp = useMemo(
    () =>
      progressBarDetails.map((detail) => (
        <div
          style={{ borderColor: detail.hexCode }}
          key={detail.label}
          className="border-r-2 bg-gray-50 w-40 sm:w-52 lg:w-72 xl:w-80 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 rounded-md shadow-md flex justify-between items-center px-5 py-2.5 sm:py-0"
        >
          <CircularProgressbar
            className="hidden lg:inline lg:size-24 xl:size-24"
            value={detail.percentage}
            text={`${detail.percentage}%`}
            styles={buildStyles({
              textSize: "18px",
              textColor: "#555",
              pathTransitionDuration: 0.5,
              pathColor: detail.pathColor,
            })}
          />
          <div className="flex lg:flex-col justify-between w-full sm:py-5">
            <h1 className="text-stone-700  text-base sm:text-xl font-medium sm:text-right">
              {detail.label}
            </h1>
            <p className="text-stone-700 text-base sm:text-lg font-medium sm:text-right">
              {fetchingAssignedTicket ? (
                <span className="skeletonTd !h-3.5 !w-6"></span>
              ) : (
                detail.count
              )}
            </p>
          </div>
        </div>
      )),
    [progressBarDetails, fetchingAssignedTicket]
  );

  return (
    <section className="min-h-full w-full">
      <h1 className="mb-5 pb-3 font-medium border-b text-lg sm:text-2xl border-gray-300">
        Assigned Tickets
      </h1>
      <main className="space-y-8">
        <section className="flex justify-start gap-10">
          <div className="bg-gray-50 w-40 sm:w-52 lg:w-72 xl:w-80 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 rounded-md shadow-md flex justify-between items-center px-5 py-5 sm:border-none">
            <span className="text-stone-700  text-base sm:text-xl font-medium">
              Total Tickets
            </span>
            <span className="text-stone-700  text-base sm:text-xl font-medium">
              {totalAssignedTickets}
            </span>
          </div>

          {fetchingUserProfile ? (
            <div className="bg-gray-50 min-w-max w-72 xl:w-80 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 rounded-md shadow-md flex flex-col px-5 py-5 sm:border-none">              
              <p className="text-right"><span className="skeletonTd !h-3 !w-24"></span></p>
              <p className="text-right"><span className="skeletonTd !h-3 !w-52"></span></p>

            </div>
          ) : (
            <div className="bg-gray-50 min-w-max w-72 xl:w-80 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 rounded-md shadow-md flex flex-col px-5 py-5 sm:border-none">
              <p className="font-medium text-[#444] text-lg text-right capitalize">{userRec.name}</p>
              <p className="font-medium text-[#444] text-base text-right">{userRec.email}</p>
            </div>
          )}
        </section>

        <div className="flex gap-10">{progressBarDetailsComp}</div>
        <section>
          {fetchingAssignedTicket ? (
            <TableSkeleton />
          ) : (
            <TableWithPagination
              tableHeading={tableHeading}
              tableRowData={tableRowData}
            />
          )}
        </section>
      </main>
    </section>
  );
}
