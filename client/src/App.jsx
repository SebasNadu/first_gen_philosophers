// import ExamplePage from "./pages/example";
import "./App.css";
import CreateArticlePage from "./pages/CreateArticlePage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./pages/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: "root",
    // loader: tokenLoader,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "create-article",
        element: <CreateArticlePage />,
        // action: authAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
