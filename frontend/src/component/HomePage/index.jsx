import { CheckIcon } from "@heroicons/react/24/outline";
import supportGirlGif from "../../public/supportGirl.gif";

export default function HomePage() {
  return (
    <section className=" bg-gray-100 rounded-xl w-full">
      <main className="flex flex-col xl:flex-row h-full p-20">
        <div className="flex flex-col justify-center h-full gap-10 w-full max-w-2xl">
          <h1 className="text-7xl font-bold">Support Ticket</h1>
          <div className="flex flex-col gap-5">
            <div className="flex gap-2">
              <CheckIcon className="size-5 mt-1.5 text-[#444]" />
              <p className="text-xl font-medium text-[#444]">A fast and simple ticket portal for your employees.</p>
            </div>
            <div className="flex gap-2">
              <CheckIcon className="size-5 mt-1.5 text-[#444]" />
              <p className="text-xl font-medium text-[#444]">Manage all employee support ticket from a central dashboard.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center h-full">
          <img src={supportGirlGif} className=" md:h-72" />
        </div>
      </main>
    </section>
  );
}
