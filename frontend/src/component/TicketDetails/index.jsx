import { ViewOrupdateUserTicket } from "../ViewOrUpdateTicket/index";

export default function TicketDetails() {
  return (
    <section className="h-full w-full">      
      <ViewOrupdateUserTicket />
      <div className="flex justify-center items-center text-gray-600 text-sm font-medium mt-5">
        <p>*Updates are only allowed when the ticket status is open.</p>
      </div>
    </section>
  );
}
