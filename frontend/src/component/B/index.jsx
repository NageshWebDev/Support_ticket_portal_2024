import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllUserTicketsQuery } from "../../store/api/userTicketAPI";
import { setTicketData } from "../../store/feature/ticketSlice";
import GenericFilter from "../Generic/Filter";
import { GenericSearchBox } from "../Generic/SearchBox";
import TableSkeleton from "../Generic/TableSkeleton";
import { TableWithPagination } from "../Generic/TableWithPagination";
import { filterOptions } from "../../util/constant";
import { useSearchParams } from "react-router-dom";

export function B() {
  const userId = useSelector((state) => state.userInfoReducer.userId);
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState(filterOptions[0]);
  const { isLoading, data } = useGetAllUserTicketsQuery(userId);

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
  }, [isLoading, data]);

  return (
    <section className="space-y-5">
      <h1 className="my-5 font-medium border-b text-2xl border-gray-300 pb-3">
        View Tickets
      </h1>
      <GenericSearchBox disabled={isLoading} />
      <div>
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
        {isLoading ? <TableSkeleton /> : <TableWithPagination />}
      </div>
    </section>
  );
}
