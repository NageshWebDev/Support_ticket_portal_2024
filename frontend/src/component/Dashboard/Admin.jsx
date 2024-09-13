import {
  useGetAssignedTicketsQuery,
  useGetUserProfileQuery,
} from "../../store/api/userTicketAPI";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useSelector } from "react-redux";
import { Square3Stack3DIcon, UserIcon } from "@heroicons/react/24/outline";

export default function Dashboard() {
  const userId = useSelector((state) => state.userInfoReducer.userId);
  const [totalAssignedTickets, setTotalAssignedTickets] = useState(0);
  const [userRec, setUserRec] = useState({ userName: "", userEmail: "" });
  const [progressBarDetails, setProgressBarDetails] = useState([
    {
      count: 0,
      percentage: 0,
      pathColor: "rgb(255,83,73)",
      hexCode: "#FF5349",
      label: "Open",
      query: "open",
      description:
        "The number of tickets that are still pending and awaiting resolution, requiring further action.",
    },
    {
      count: 0,
      percentage: 0,
      pathColor: "rgb(255,191,0)",
      hexCode: "#FFBF00",
      label: "In-Process",
      query: "inProcess",
      description:
        "The count of tickets that are currently being worked on by you but have not yet been resolved.",
    },
    {
      count: 0,
      percentage: 0,
      pathColor: "rgb(41,171,135)",
      hexCode: "#29AB87",
      label: "Resolved",
      query: "resolved",
      description:
        "The total number of tickets that have been successfully addressed and closed by you.",
    },
  ]);
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
    }
  }, [fetchingAssignedTicket, assignedTickets]);

  const progressBarDetailsComp = useMemo(
    () =>
      progressBarDetails.map((detail) => (
        <NavLink
          to={`/ticket/view?status=${detail.query}`}
          key={detail.label}
          className="bg-gray-50 w-full hover:shadow-lg hover:shadow-black/20 transition-all duration-300 rounded-md shadow-md flex justify-between items-center px-5 py-5 sm:border-none"
        >
          <div className="flex lg:flex-col justify-between w-full sm:py-5 gap-2.5">
            <div
              style={{ backgroundColor: detail.hexCode }}
              className="text-white py-1.5 px-5 rounded text-base sm:text-xl font-medium flex justify-between w-48"
            >
              <span>{detail.label}</span>
              {fetchingAssignedTicket ? (
                <span className="skeletonTd !h-3.5 !w-6"></span>
              ) : (
                <span>{detail.count}</span>
              )}
            </div>
            <div className="text-stone-700 text-base w-full font-medium">
              <span>{detail.description}</span>
            </div>
          </div>
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
        </NavLink>
      )),
    [progressBarDetails, fetchingAssignedTicket]
  );

  return (
    <section className="min-h-full w-full">
      <main className="space-y-20">
        <section className="mt-10 flex justify-start gap-10">
          <div className="bg-gray-50 w-80 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 rounded-md shadow-md flex justify-between gap-2 items-center px-5 py-5 sm:border-none">
            <Square3Stack3DIcon className="size-10 text-blue-600" />
            <span className="text-stone-700  text-base sm:text-xl font-medium">
              Total Assigned Tickets
            </span>
            <span className="text-stone-700  text-base sm:text-xl font-medium">
              {totalAssignedTickets}
            </span>
          </div>

          {fetchingUserProfile ? (
            <div className="bg-gray-50 min-w-max w-72 xl:w-80 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 rounded-md shadow-md flex justify-between items-center px-5 py-5 sm:border-none">
              <UserIcon className="size-10" />
              <div>
                <p className="text-right">
                  <span className="skeletonTd !h-3 !w-24"></span>
                </p>
                <p className="text-right">
                  <span className="skeletonTd !h-3 !w-52"></span>
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 min-w-max w-72 xl:w-80 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 rounded-md shadow-md flex justify-between items-center px-5 py-5 sm:border-none">
              <UserIcon className="size-10" />
              <div>
                <p className="font-medium text-[#444] text-lg text-right capitalize">
                  {userRec.name}
                </p>
                <p className="font-medium text-[#444] text-base text-right">
                  {userRec.email}
                </p>
              </div>
            </div>
          )}
        </section>

        <div className="flex flex-col gap-10 w-full max-w-5xl">
          {progressBarDetailsComp}
        </div>
      </main>
    </section>
  );
}
