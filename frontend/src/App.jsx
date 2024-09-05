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
import Dashboard from "./component/Dashboard";

function TicketViewWrapper() {
  const isAdmin =
    useSelector((state) => state.userInfoReducer.userRole) === "admin";
  return isAdmin ? <AcknowledgeTicket /> : <TicketDetails />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
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
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
