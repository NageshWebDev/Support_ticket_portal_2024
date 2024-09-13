import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import DropdownMenu from "../component/Generic/Dropdownmenu";
import { useDispatch, useSelector } from "react-redux";
import {
  UserCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  ChevronLeftIcon,
} from "@heroicons/react/16/solid";

import { useLogoutMutation } from "../store/api/loginAPI";
import GenericDialogBox from "./Generic/Dialog";
import { useMemo, useRef } from "react";
import { DialogTitle } from "@headlessui/react";
import { setTicketStoreEmpty } from "../store/feature/ticketSlice";
import { setUserStoreEmpty } from "../store/feature/userInfoSlice";
import { removeUserInfoFromLocalStorage } from "../util/localStorage";

import useAuth from "../hooks/useauth";

export default function Layout() {
  const location = useLocation();
  const { pathname } = location;
  const { tokenId, loading } = useAuth();
  const userName = useSelector((state) => state.userInfoReducer.userName);
  const userEmail = useSelector((state) => state.userInfoReducer.userEmail);
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();
  const genericDialogRef = useRef();
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const dTitle = useMemo(
    () => (
      <DialogTitle
        as="h3"
        className="dialogTitle data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      >
        Logging out!!
      </DialogTitle>
    ),
    []
  );

  const dBody = useMemo(
    () => (
      <div className="font-medium flex flex-col w-full mt-2 m-5 text-gray-700">
        <p className="text-center ">
          Are you sure you want to permanently delete this ticket?
        </p>
        <p className="text-center text-sm my-5">
          <span className="bg-red-100 w-max px-2 py-1 rounded-md border border-red-200 text-red-500">
            *This action cannot be undone.
          </span>
        </p>
      </div>
    ),
    []
  );

  async function onSignOutHandler() {
    try {
      await logout().unwrap();
      dispatch(setTicketStoreEmpty());
      dispatch(setUserStoreEmpty());
      removeUserInfoFromLocalStorage();
      navigateTo("/login");
    } catch (error) {
      console.error("Something went wrong Error X_x : ", error);
    }
  }

  // Show loading screen if data is still being fetched
  if (loading) return <div>Loading...</div>;

  return (
    <section className="flex flex-col min-h-screen bg-gray-200">
      <nav className="bg-white shadow flex justify-between items-center px-5 pr-10 xl:px-10 xl:pr-16 py-2 text-gray-800">
        <div className="flex justify-between items-center gap-10">
          {tokenId ? (
            <div className="flex justify-center items-center gap-2">
              <NavLink
                onClick={() => navigateTo(-1)}
                className={`text-xl ${
                  pathname === "/" ? "invisible" : "visible"
                }`}
              >
                <ChevronLeftIcon className="mt-1 size-7 hover:bg-gray-200 rounded-full" />
              </NavLink>

              <NavLink to="/" className="text-xl">
                <span className="font-bold text-2xl">D</span>
                <span>ashboard</span>
              </NavLink>
            </div>
          ) : (
            <NavLink to="/" className="text-xl">
              <span className="font-bold text-2xl">H</span>
              <span>ome</span>
            </NavLink>
          )}
        </div>
        {tokenId ? (
          <div className="flex justify-center items-center gap-3">
            <DropdownMenu />
            <div className="group relative">
              <UserCircleIcon className="size-10 text-[#444] hover:text-[#333]" />
              <div className="mt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-500 ease-in-out transform -translate-y-2 translate-x-2 absolute top-10 right-0 bg-white border shadow-lg w-max rounded-md">
                <div className="py-2 px-5">
                  <p className="text-right font-medium text-gray-800 text-lg capitalize">
                    {userName}
                  </p>
                  <p className="text-right font-medium text-gray-500 text-sm">
                    {userEmail}
                  </p>
                </div>
                <div className="my-1 h-px mx-2 bg-gray-200" />
                <div className="w-full text-red-700 py-2 px-2">
                  <NavLink
                    to="/"
                    className="font-medium flex gap-2 w-full justify-end items-center rounded px-3 duration-500 transition-all hover:gap-5"
                  >
                    <ArrowLeftStartOnRectangleIcon className="size-4" />
                    <button onClick={onSignOutHandler}> Sign Out </button>
                  </NavLink>
                </div>
              </div>
            </div>
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
      <section className="w-full h-full px-5 2xl:px-52 py-5 flex flex-grow">
        <Outlet />
      </section>
      {loggingOut && (
        <GenericDialogBox
          ref={genericDialogRef}
          dTitle={dTitle}
          dBody={dBody}
        />
      )}
    </section>
  );
}
