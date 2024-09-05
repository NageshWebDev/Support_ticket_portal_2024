import { ArrowLongLeftIcon } from "@heroicons/react/20/solid";
import { ViewOrupdateUserTicket } from "../ViewOrUpdateTicket/index";
import { NavLink } from "react-router-dom";

export default function TicketDetails() {
  return (
    <section className="flex flex-col gap-3">
      <div className="absolute left-0 bg-gray-50 px-3 py-1 rounded-r-full shadow-md">
        <NavLink
          to={-1}
          className="group text-gray-600 hover:text-gray-800 flex items-center gap-1 px-2 text-sm font-medium"
        >
          <ArrowLongLeftIcon className="group-hover:-translate-x-2 size-5 duration-500 transition-all" />
          Back
        </NavLink>
      </div>

      <ViewOrupdateUserTicket />
      <div className="flex justify-center items-center text-gray-600 text-sm font-medium ">
        <p>*Updates are only allowed when the ticket status is open.</p>
      </div>
    </section>
  );
}
