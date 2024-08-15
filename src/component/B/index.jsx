import { useEffect, useState } from "react";
import GenericFilter from "../Generic/Filter";
import { GenericSearchBox } from "../Generic/SearchBox";
import { TableWithPagination } from "../Generic/TableWithPagination";

const filterOptions = [
  {
    id: "all",
    filterId: "ALL",
    name: "All",
    description: "view all tickets",
    icon: "inboxStack",
  },
  {
    id: "open",
    filterId: "OPEN",
    name: "Open",
    description: "view unresolved tickets only",
    icon: "envelope",
  },
  {
    id: "resolve",
    filterId: "RESOLVE",
    name: "Resolve",
    description: "view resolved tickets only",
    icon: "envelopeOpen",
  },
];

const dummyData = [
  {
    ticketId: 101,
    createdAt: "1 Aug 2024",
    lastUpdatedAt: "1 Aug 2024",
    urgency: "Low",
    category: "A",
    status: "Open",
    filterId: "OPEN",
  },
  {
    ticketId: 102,
    createdAt: "2 Aug 2024",
    lastUpdatedAt: "2 Aug 2024",
    urgency: "Low",
    category: "A",
    status: "Open",
    filterId: "OPEN",
  },
  {
    ticketId: 103,
    createdAt: "3 Aug 2024",
    lastUpdatedAt: "3 Aug 2024",
    urgency: "Low",
    category: "B",
    status: "Resolved",
    filterId: "RESOLVE",
  },
  {
    ticketId: 104,
    createdAt: "4 Aug 2024",
    lastUpdatedAt: "4 Aug 2024",
    urgency: "Low",
    category: "B",
    status: "Resolved",
    filterId: "RESOLVE",
  },
  {
    ticketId: 105,
    createdAt: "1 Aug 2024",
    lastUpdatedAt: "1 Aug 2024",
    urgency: "Low",
    category: "A",
    status: "Open",
    filterId: "OPEN",
  },
  {
    ticketId: 106,
    createdAt: "2 Aug 2024",
    lastUpdatedAt: "2 Aug 2024",
    urgency: "Low",
    category: "A",
    status: "Open",
    filterId: "OPEN",
  },
  {
    ticketId: 107,
    createdAt: "3 Aug 2024",
    lastUpdatedAt: "3 Aug 2024",
    urgency: "Low",
    category: "B",
    status: "Resolved",
    filterId: "RESOLVE",
  },
  {
    ticketId: 108,
    createdAt: "4 Aug 2024",
    lastUpdatedAt: "4 Aug 2024",
    urgency: "Low",
    category: "B",
    status: "Resolved",
    filterId: "RESOLVE",
  },
  {
    ticketId: 109,
    createdAt: "1 Aug 2024",
    lastUpdatedAt: "1 Aug 2024",
    urgency: "Low",
    category: "A",
    status: "Open",
    filterId: "OPEN",
  },
  {
    ticketId: 110,
    createdAt: "2 Aug 2024",
    lastUpdatedAt: "2 Aug 2024",
    urgency: "Low",
    category: "A",
    status: "Open",
    filterId: "OPEN",
  },
  {
    ticketId: 111,
    createdAt: "3 Aug 2024",
    lastUpdatedAt: "3 Aug 2024",
    urgency: "Low",
    category: "B",
    status: "Resolved",
    filterId: "RESOLVE",
  },
  {
    ticketId: 112,
    createdAt: "4 Aug 2024",
    lastUpdatedAt: "4 Aug 2024",
    urgency: "Low",
    category: "B",
    status: "Resolved",
    filterId: "RESOLVE",
  },
  {
    ticketId: 113,
    createdAt: "1 Aug 2024",
    lastUpdatedAt: "1 Aug 2024",
    urgency: "Low",
    category: "A",
    status: "Open",
    filterId: "OPEN",
  },
  {
    ticketId: 114,
    createdAt: "2 Aug 2024",
    lastUpdatedAt: "2 Aug 2024",
    urgency: "Low",
    category: "A",
    status: "Open",
    filterId: "OPEN",
  },
  {
    ticketId: 115,
    createdAt: "3 Aug 2024",
    lastUpdatedAt: "3 Aug 2024",
    urgency: "Low",
    category: "B",
    status: "Resolved",
    filterId: "RESOLVE",
  },
  {
    ticketId: 116,
    createdAt: "4 Aug 2024",
    lastUpdatedAt: "4 Aug 2024",
    urgency: "Low",
    category: "B",
    status: "Resolved",
    filterId: "RESOLVE",
  },
  {
    ticketId: 117,
    createdAt: "1 Aug 2024",
    lastUpdatedAt: "1 Aug 2024",
    urgency: "Low",
    category: "A",
    status: "Open",
    filterId: "OPEN",
  },
  {
    ticketId: 118,
    createdAt: "2 Aug 2024",
    lastUpdatedAt: "2 Aug 2024",
    urgency: "Low",
    category: "A",
    status: "Open",
    filterId: "OPEN",
  },
  {
    ticketId: 119,
    createdAt: "3 Aug 2024",
    lastUpdatedAt: "3 Aug 2024",
    urgency: "Low",
    category: "B",
    status: "Resolved",
    filterId: "RESOLVE",
  },
  {
    ticketId: 120,
    createdAt: "4 Aug 2024",
    lastUpdatedAt: "4 Aug 2024",
    urgency: "Low",
    category: "B",
    status: "Resolved",
    filterId: "RESOLVE",
  },
  {
    ticketId: 121,
    createdAt: "1 Aug 2024",
    lastUpdatedAt: "1 Aug 2024",
    urgency: "Low",
    category: "A",
    status: "Open",
    filterId: "OPEN",
  },
  {
    ticketId: 122,
    createdAt: "2 Aug 2024",
    lastUpdatedAt: "2 Aug 2024",
    urgency: "Low",
    category: "A",
    status: "Open",
    filterId: "OPEN",
  },
  {
    ticketId: 123,
    createdAt: "3 Aug 2024",
    lastUpdatedAt: "3 Aug 2024",
    urgency: "Low",
    category: "B",
    status: "Resolved",
    filterId: "RESOLVE",
  },
  {
    ticketId: 124,
    createdAt: "4 Aug 2024",
    lastUpdatedAt: "4 Aug 2024",
    urgency: "Low",
    category: "B",
    status: "Resolved",
    filterId: "RESOLVE",
  },
];
export function B() {
  const [tableData, setTableData] = useState(dummyData);
  const [selectedFilterId, setSelectedFilterId] = useState("ALL");

  function filterHandler(selectedOption) {
    const { filterId } = selectedOption;
    console.log('filterId : ', filterId);
    setSelectedFilterId(filterId);
  }

  useEffect(() => {
    console.log("tableData : ", tableData);
  }, [tableData]);

  return (
    <section className="space-y-10">
      <GenericSearchBox />
      <div>
        <div className="flex justify-end items-center ">
          <div className="flex justify-center items-center gap-2 mb-1">
            <span className="font-medium text-sm text-gray-800">
              Filter by status :
            </span>
            <GenericFilter
              options={filterOptions}
              onSelectFilterHandler={filterHandler}
            />
          </div>
        </div>
        <TableWithPagination
          tableRowData={tableData}
          selectedFilterId={selectedFilterId}
        />
      </div>
    </section>
  );
}
