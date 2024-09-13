import "react-circular-progressbar/dist/styles.css";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Square3Stack3DIcon,
  DocumentMinusIcon,
  DocumentPlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { NavLink } from "react-router-dom";
import { TableWithPagination } from "../Generic/TableWithPagination";
import {
  useGetAdminEmailAndIdListQuery,
  useGetAllTicketOverviewQuery,
  useGetSuperAdminDetailsQuery,
} from "../../store/api/userTicketAPI";
import { useSelector } from "react-redux";
import getStatusClass from "../../util/getStatusClass";
import TableSkeleton from "../Generic/TableSkeleton";

const tableHeading = [
  "Sn.No.",
  "Name",
  "Email",
  "Open",
  "In Process",
  "Resolve",
  "T.Assigned",
];
const iconMap = {
  square3Stack3DIcon: Square3Stack3DIcon,
  documentMinusIcon: DocumentMinusIcon,
  documentPlusIcon: DocumentPlusIcon,
};

export default function Dashboard() {
  const userId = useSelector((state) => state.userInfoReducer.userId);

  const [ticketAssignUnassign, setTicketAssignUnassign] = useState([
    {
      icon: "square3Stack3DIcon",
      label: "Total",
      count: 0,
      hexCode: "#0066FF",
      iconColor: "text-blue-600",
      query: "all",
    },
    {
      icon: "documentPlusIcon",
      label: "Assigned",
      count: 0,
      hexCode: "#29AB87",
      iconColor: "text-green-600",
      query: "assigned",
    },
    {
      icon: "documentMinusIcon",
      label: "Unassigned",
      count: 0,
      hexCode: "#FF5349",
      iconColor: "text-rose-600",
      query: "unassigned",
    },
  ]);

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

  const { isLoading: isfetchingTicketOverview, data: allTicketOverview } =
    useGetAllTicketOverviewQuery({ userId });

  const { isLoading: fetchingAdminDetails, data: adminDetails } =
    useGetAdminEmailAndIdListQuery({ userId }, { skip: !userId });

  const { isLoading: fetchingSuperAdminDetails, data: superAdminDetails } =
    useGetSuperAdminDetailsQuery({ userId });

  const [tableRowData, setTableRowData] = useState([]);

  useEffect(() => {
    if (!isfetchingTicketOverview && allTicketOverview) {
      if (allTicketOverview.data) {
        const {
          assignedTickets,
          inprocess,
          notAssignedTickets,
          open,
          resolved,
        } = allTicketOverview.data;

        const totalTicketCount = assignedTickets + notAssignedTickets;

        setTicketAssignUnassign((preVal) => [
          {
            ...preVal[0],
            count: totalTicketCount,
          },
          {
            ...preVal[1],
            count: assignedTickets,
          },
          {
            ...preVal[2],
            count: notAssignedTickets,
          },
        ]);

        setProgressBarDetails((preVal) => [
          {
            ...preVal[0],
            count: open,
            percentage: Math.floor((open / totalTicketCount) * 100),
          },
          {
            ...preVal[1],
            count: inprocess,
            percentage: Math.floor((inprocess / totalTicketCount) * 100),
          },
          {
            ...preVal[2],
            count: resolved,
            percentage: Math.floor((resolved / totalTicketCount) * 100),
          },
        ]);
      }
    }
  }, [isfetchingTicketOverview, allTicketOverview]);

  useEffect(() => {
    if (!fetchingAdminDetails && adminDetails) {
      const fetchedData = adminDetails?.data;

      setTableRowData(
        fetchedData
          .map((data) => ({
            id: data._id,
            href: `/ticket/assigned/${data._id}`,
            name: data.name,
            email: data.email,
            open: `${data.open} CSS_CLASS ${getStatusClass("Open")}`,
            inProcess: `${data.inProcess} CSS_CLASS ${getStatusClass(
              "Inprocess"
            )}`,
            resolve: `${data.resolve} CSS_CLASS ${getStatusClass("Resolved")}`,
            assignedTickets: `${data.open + data.inProcess + data.resolve}`,
          }))
          .sort((detailOne, detailTwo) =>
            detailOne.name.localeCompare(detailTwo.name)
          )
      );
    }
  }, [adminDetails, fetchingAdminDetails]);

  const superAdminProfileRef = useRef(null);

  useEffect(() => {
    if (!fetchingSuperAdminDetails && superAdminDetails) {
      superAdminProfileRef.current = (
        <div className="flex flex-col justify-center">
          <p className="text-right font-medium text-gray-700 capitalize text-lg">
            {superAdminDetails?.data.name}
          </p>
          <p className="text-right font-medium text-gray-700">
            {superAdminDetails?.data.email}
          </p>
        </div>
      );
    }
  }, [fetchingSuperAdminDetails, superAdminDetails]);

  const progressBarDetailsComp = useMemo(
    () =>
      progressBarDetails.map((detail) => (
        <NavLink
          key={detail.label}
          to={`/ticket/view?status=${detail.query}`}
          style={{ borderColor: detail.hexCode }}
          className="border-t-2 bg-gray-50 w-40 sm:w-52 lg:w-72 xl:w-80 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 rounded-md shadow-md flex justify-between items-center px-5 py-2.5 sm:py-0"
        >
          <CircularProgressbar
            className="hidden lg:inline lg:size-24 xl:size-32"
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
              {isfetchingTicketOverview ? (
                <span className="skeletonTd !h-3.5 !w-6"></span>
              ) : (
                detail.count
              )}
            </p>
          </div>
        </NavLink>
      )),
    [progressBarDetails, isfetchingTicketOverview]
  );

  return (
    <section className="min-h-full w-full">
      <h1 className="mb-5 pb-3 font-medium border-b text-lg sm:text-2xl border-gray-300">
        Tickets Overview
      </h1>

      <section className="flex justify-start md:grid md:grid-cols-8 gap-20 w-full">
        <section className="flex flex-col 2xl:justify-between md:flex-row gap-10 col-span-4 md:col-span-8 2xl:col-span-6">
          {ticketAssignUnassign.map((detail) => {
            const IconComponent = iconMap[detail.icon];
            return (
              <NavLink
                key={detail.label}
                to={`/ticket/view?status=${detail.query}`}
                style={{ borderColor: detail.hexCode }}
                className="border-r-2 bg-white rounded-md shadow-md hover:shadow-lg hover:shadow-black/20 transition-all duration-300 w-40 sm:w-52 lg:w-72 xl:w-80 flex justify-between items-center px-5 py-2.5 sm:py-5"
              >
                <IconComponent
                  className={`hidden lg:inline lg:size-10 ${detail.iconColor} m-2`}
                />
                <div className="flex lg:flex-col justify-between w-full">
                  <h1 className="text-stone-700  text-base sm:text-xl font-medium sm:text-right">
                    {detail.label}
                    <span className="hidden lg:inline"> Ticket</span>
                  </h1>
                  <p className="text-stone-700  text-base sm:text-lg font-medium sm:text-right">
                    {isfetchingTicketOverview ? (
                      <span className="skeletonTd !h-3.5 !w-6"></span>
                    ) : (
                      detail.count
                    )}
                  </p>
                </div>
              </NavLink>
            );
          })}
        </section>
        <section className=" md:hidden col-span-4 flex flex-col gap-10">
          {progressBarDetailsComp}
        </section>

        <section className="hidden 2xl:block col-span-2 w-full">
          <div className="shadow-md bg-gray-50 rounded-md h-full flex justify-between p-5 w-44 sm:w-80">
            <div className="flex justify-center items-center">
              <UserIcon className="size-10" />
            </div>
            <div className="flex justify-end">
              {fetchingSuperAdminDetails ? (
                <p>Fetching Super Admin Details...</p>
              ) : (
                superAdminProfileRef.current
              )}
            </div>
          </div>
        </section>
      </section>

      <section className="mt-20 flex flex-col-reverse 2xl:grid 2xl:grid-cols-8 gap-20">
        <div className="2xl:col-span-6">
          {fetchingAdminDetails ? (
            <TableSkeleton />
          ) : (
            <TableWithPagination
              tableHeading={tableHeading}
              tableRowData={tableRowData}
            />
          )}
        </div>

        <section className="hidden 2xl:col-span-2 md:flex 2xl:flex-col gap-10 col-span-8 w-full flex-col md:flex-row">
          {progressBarDetailsComp}
        </section>
      </section>
    </section>
  );
}
