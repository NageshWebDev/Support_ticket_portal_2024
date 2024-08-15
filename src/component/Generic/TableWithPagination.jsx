import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { useEffect, useMemo, useState } from "react";

const numberOfRows = 5;
const tableHeading = [
  "Sn.No.",
  "Ticket Id",
  "Created at",
  "Last updated at",
  "Urgency",
  "Category",
  "Status",
];

function getStatusClass(status) {
  const baseStyle =
    "px-5 py-0.5 text-center inline-block w-28 rounded-full font-medium";

  switch (status.toLowerCase()) {
    case "open":
      return `${baseStyle} bg-white border border-black/30 tracking-wider`;

    case "resolved":
      return `${baseStyle} bg-[#444] text-white border border-black/30 tracking-wider`;

    default:
      return `${baseStyle}`;
  }
}

function getTotalPage(tableRowData) {
  return Math.ceil(tableRowData.length / numberOfRows);
}

export function TableWithPagination({ tableRowData, selectedFilterId }) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTableRowData = useMemo(() => {
    setCurrentPage(1)
    switch (selectedFilterId) {
      case "OPEN":
        return tableRowData.filter((data) => data.filterId === "OPEN");
      case "RESOLVE":
        return tableRowData.filter((data) => data.filterId === "RESOLVE");
      case "ALL":
      default:
        return tableRowData;
    }
  }, [selectedFilterId, tableRowData]);

  const totalPage = getTotalPage(filteredTableRowData);

  const paginatedData = useMemo(() => {
    console.log('I am called')
    const startIndex = (currentPage - 1) * numberOfRows;
    return filteredTableRowData.slice(startIndex, startIndex + numberOfRows);
  }, [currentPage, filteredTableRowData]);

  function onNextHandler() {
    console.log("onNextHandler");
    if (currentPage < totalPage) setCurrentPage((prevVal) => ++prevVal);
  }

  function onPrevHandler() {
    console.log("onPrevHandler");
    if (currentPage > 1) setCurrentPage((prevVal) => --prevVal);
  }

  return (
    <section className="formStyle h-[525px] flex flex-col justify-between">
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
              ticketId,
              createdAt,
              lastUpdatedAt,
              urgency,
              category,
              status,
            } = data;
            return (
              <tr className="genericTrow" key={ticketId}>
                <td className={"genericTbody"}>
                  {idx + 1 + (currentPage - 1) * 5}
                </td>
                <td className={"genericTbody"}>{ticketId}</td>
                <td className={"genericTbody"}>{createdAt}</td>
                <td className={"genericTbody"}>{lastUpdatedAt}</td>
                <td className={"genericTbody"}>{urgency}</td>
                <td className={"genericTbody"}>{category}</td>
                <td className={"genericTbody"}>
                  <span className={`${getStatusClass(status)}`}>{status}</span>
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
          <button onClick={onNextHandler} disabled={currentPage == totalPage}>
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
    </section>
  );
}
