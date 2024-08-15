import { NavLink, Outlet } from "react-router-dom";
import DropdownMenu from "../component/Generic/Dropdownmenu";

export default function Layout() {
  return (
    <section className="flex flex-col h-screen bg-gray-200">
      <nav className="bg-white shadow flex justify-between items-center px-5 py-2 text-gray-800">
        <NavLink to="/">
          <span className="font-bold">H</span>ome
        </NavLink>
        <DropdownMenu />
      </nav>
      <section className="h-full px-5 sm:px-20 pt-10">
        <Outlet />
      </section>
    </section>
  );
}
