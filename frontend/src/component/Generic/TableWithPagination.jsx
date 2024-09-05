import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { categoryOptions, filterName } from "../../util/constant";
import formatDatAndTime from "../../util/formatDate";
import getStatusClass from "../../util/getStatusClasss";

const numberOfRows = 5;
const tableHeading = [
  "Sn.No.",
  "Title",
  "Category",
  "Urgency",
  "Created at",
  "Status",
];

function getTotalPage(tableRowData) {
  return Math.ceil(tableRowData.length / numberOfRows);
}

export function TableWithPagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const tableRowData = useSelector((state) => state.ticketReducer.ticketData);
  const navigate = useNavigate();
  useEffect(() => setCurrentPage(1), [tableRowData]);

  const totalPage = getTotalPage(tableRowData);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * numberOfRows;
    return tableRowData.slice(startIndex, startIndex + numberOfRows);
  }, [currentPage, tableRowData]);

  function onNextHandler() {
    if (currentPage < totalPage) setCurrentPage((prevVal) => ++prevVal);
  }

  function onPrevHandler() {
    if (currentPage > 1) setCurrentPage((prevVal) => --prevVal);
  }

  function getPriorityClass(priority) {
    switch (priority) {
      case "low":
        return "!text-red-400";

      case "high":
        return "!text-red-500";

      case "urgent":
        return "!text-red-700";

      case "immediate":
        return "!text-red-900";

      default:
        break;
    }
  }

  function setExclamationMark(priority) {
    switch (priority) {
      case "urgent":
        return "!";

      case "immediate":
        return "!!";

      default:
        break;
    }
  }

  return (
    <section className="formStyle h-[525px] flex flex-col justify-between">
      {paginatedData.length ? (
        <>
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                {tableHeading.map((heading) => (
                  <th className="genericThead" key={heading}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((data, idx) => {
                const {
                  title,
                  createdAt,
                  priority,
                  category,
                  status,
                  ticketId,
                } = data;
                return (
                  <tr
                    onClick={() => navigate(`/ticket/view/${ticketId}`)}
                    className="genericTrow"
                    key={ticketId}
                  >
                    <td className={"genericTbody"}>
                      {idx + 1 + (currentPage - 1) * 5}
                    </td>
                    <td className={"genericTbody"}>{title}</td>
                    <td className={"genericTbody"}>
                      {
                        categoryOptions.find((option) => option.id === category)
                          .name
                      }
                    </td>
                    <td className={"genericTbody"}>
                      <span className={`${getPriorityClass(priority)}`}>
                        {priority} {setExclamationMark(priority)}
                      </span>
                    </td>
                    <td className={"genericTbody"}>
                      {formatDatAndTime(createdAt)}
                    </td>
                    <td className={"genericTbody"}>
                      <span className={`${getStatusClass(status)}`}>
                        {filterName[status]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-center p-2 rounded-md">
            <div className="flex items-center justify-center text-gray-500 bg-gray-200 rounded-full gap-5 p-1">
              <button onClick={onPrevHandler} disabled={currentPage == 1}>
                <ChevronLeftIcon
                  className={`size-5 ${
                    currentPage == 1
                      ? "cursor-not-allowed text-gray-400"
                      : "cursor-pointer hover:bg-gray-50 rounded-full active:scale-75"
                  }`}
                />
              </button>
              <div className="text-sm font-medium ">
                Page <span className="mx-1">{currentPage}</span> of{" "}
                <span className="mx-1">{totalPage}</span>
              </div>
              <button
                onClick={onNextHandler}
                disabled={currentPage == totalPage}
              >
                <ChevronRightIcon
                  className={`size-5 ${
                    currentPage == totalPage
                      ? "cursor-not-allowed text-gray-400"
                      : "cursor-pointer hover:bg-gray-50 rounded-full active:scale-75"
                  }`}
                />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex justify-center items-center gap-2.5">
          <MagnifyingGlassIcon className="text-gray-400 size-10 " />
          <p className="text-gray-400 text-xl">No ticket found</p>
        </div>
      )}
    </section>
  );
}
