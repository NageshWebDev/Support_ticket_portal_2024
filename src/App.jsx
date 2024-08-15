import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { A } from "./component/A";
import { B } from "./component/B";
import ErrorPage from "./component/ErrorPage";
import Layout from "./component/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <p>home page</p> },
      {
        path: "/ticket",
        children: [
          {
            path: "create",
            element: <A />,
          },
          {
            path: "view",
            element: <B />,
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
