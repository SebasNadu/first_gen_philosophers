// import ExamplePage from "./pages/example";
import "./App.css";
import CreateArticlePage from "./pages/CreateArticlePage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import RootLayout from "./pages/Root";
import AuthenticationPage from "./pages/AuthenticationPage";
import DiscoverPage from "./pages/DiscoverPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import EditArticlePage from "./pages/EditArticlePage";
import ProfilePage from "./pages/ProfilePage";

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
        path: "auth",
        element: <AuthenticationPage />,
        // action: authAction,
      },
      {
        path: "discover",
        element: <DiscoverPage />,
        // action: authAction,
      },
      {
        path: "articles",
        children: [
          {
            index: true,
            // element: <DiscoverPage />,
            // loader: eventsLoader,
          },
          {
            path: ":articleId",
            id: "article-detail",
            // loader: eventDetailLoader,
            children: [
              {
                index: true,
                element: <ArticleDetailPage />,
                // action: deleteEventAction,
              },
              {
                path: "edit",
                element: <EditArticlePage />,
                // action: manipulateEventAction,
                // loader: checkAuthLoader,
              },
            ],
          },
          {
            path: "create",
            element: <CreateArticlePage />,
            // action: manipulateEventAction,
            // loader: checkAuthLoader,
          },
        ],
      },
      {
        path: "profile",
        element: <ProfilePage />,
        // action: newsletterAction,
      },
      {
        path: "logout",
        // action: logoutAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
