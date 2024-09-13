import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { A } from "./component/A";
import { B } from "./component/B";
import { Login } from "./component/Login";
import ErrorPage from "./component/ErrorPage";
import Layout from "./component/Layout";
import TicketDetails from "./component/TicketDetails";
import AcknowledgeTicket from "./component/AcknowledgeTicket";
import { Signup } from "./component/Signup";
import { RequireAuth } from "./component/RequireAuth";
import { useSelector } from "react-redux";
import AdminAssignedTicket from "./component/AdminAssignedTicket";
import DashboardSuperAdmin from "./component/Dashboard/SuperAdmin";
import DashboardAdmin from "./component/Dashboard/Admin";
import DashboardUser from "./component/Dashboard/User";
import HomePage from "./component/HomePage";

function TicketViewWrapper() {
  const userRole = useSelector((state) => state.userInfoReducer.userRole);

  return ["ADMIN", "SUPER_ADMIN"].includes(userRole) ? (
    <AcknowledgeTicket />
  ) : (
    <TicketDetails />
  );
}

function HomeWrapper() {
  const userRole = useSelector((state) => state.userInfoReducer.userRole) || null;

  switch (userRole) {
    case "SUPER_ADMIN":
      return <DashboardSuperAdmin />

      case "ADMIN":
        return <DashboardAdmin />

        case "USER":
          return <DashboardUser />
  
    default:
      return <HomePage />
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomeWrapper /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        path: "/ticket",
        element: <RequireAuth />,
        children: [
          {
            path: "create",
            element: <A />,
          },
          {
            path: "view",
            element: <B />,
          },
          {
            path: "view/:ticketId",
            element: <TicketViewWrapper />,
          },
          {
            path: "assigned/:adminId",
            element: <AdminAssignedTicket />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
