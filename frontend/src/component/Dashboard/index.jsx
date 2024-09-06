import { useEffect, useState } from "react";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { NavLink } from "react-router-dom";

export default function Dashboard() {
  // total ticket
  // open ticket
  // resolve ticket

  // Get admin record
  // Get manage tickets
  // --> assign ticket
  // --> delete ticket
  // --> action ticket

  const [percentage, setPercentage] = useState(75);

  const progressBarDetails = [
    {
      percentage: 25,
      pathColor: "rgb(255,83,73)",
      label: "Open",
      query: "open",
    },
    {
      percentage: 50,
      pathColor: "rgb(255,191,0)",
      label: "In-Process",
      query: "inProcess",
    },
    {
      percentage: 25,
      pathColor: "rgb(41,171,135)",
      label: "Resolved",
      query: "resolved",
    },
  ];

  return (
    <section className="min-h-full">
      <main className="flex flex-wrap gap-5">
        <div className="bg-gray-50 rounded-md shadow-md w-80 flex justify-between items-center gap-5 p-5">
          <div className="size-20 flex justify-center items-center border-4 border-blue-400 rounded-full">
            <Square3Stack3DIcon className="size-10 text-blue-500" />
          </div>

          <div>
            <h1 className="text-stone-700 text-xl font-medium">Total Ticket</h1>
            <p className="text-stone-700 text-base font-medium text-right">
              45
            </p>
          </div>
        </div>

        {progressBarDetails.map((detail) => (
          <NavLink
            key={detail.label}
            to={`/ticket/view?status=${detail.query}`}
            className="bg-gray-50 rounded-md shadow-md w-80 flex justify-between items-center gap-5 p-5"
          >
            <CircularProgressbar
              className="size-20"
              value={detail.percentage}
              text={`${detail.percentage}%`}
              styles={buildStyles({
                textSize: "18px",
                textColor: "#555",
                pathTransitionDuration: 0.5,
                pathColor: detail.pathColor,
              })}
            />
            <div>
              <h1 className="text-stone-700 text-xl font-medium">
                {detail.label} Ticket
              </h1>
              <p className="text-stone-700 text-base font-medium text-right">
                {detail.percentage}
              </p>
            </div>
          </NavLink>
        ))}
      </main>
    </section>
  );
}
