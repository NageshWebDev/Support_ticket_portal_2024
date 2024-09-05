import { NavLink, Outlet } from "react-router-dom";
import DropdownMenu from "../component/Generic/Dropdownmenu";
import { useSelector } from "react-redux";
import { UserCircleIcon } from "@heroicons/react/16/solid";
import { useEffect } from "react";

export default function Layout() {
  const tokenId = useSelector((state) => state.userInfoReducer.tokenId);

  return (
    <section className="flex flex-col h-screen bg-gray-200">
      <nav className="bg-white shadow flex justify-between items-center px-5 xl:px-10 py-5 text-gray-800">
        <div className="flex justify-between items-center gap-10">
          <NavLink to="/" className="text-xl">
            <span className="font-bold text-2xl">H</span>ome
          </NavLink>
        </div>
        {tokenId ? (
          <div className="flex justify-center items-center gap-3">
            <DropdownMenu />
            <UserCircleIcon className="size-10 text-[#444] hover:text-[#333]" />
          </div>
        ) : (
          <div className="flex justify-center items-center gap-1">
            <UserCircleIcon className="size-10 text-[#444] hover:text-[#333]" />
            <NavLink to="/login" className="text-xl">
              <span className="font-bold text-2xl">L</span>ogin
            </NavLink>
          </div>
        )}
      </nav>
      <section className="h-full px-5 xl:px-52 py-10">
        <Outlet />
      </section>
    </section>
  );
}
