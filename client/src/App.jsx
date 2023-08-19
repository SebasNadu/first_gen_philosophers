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
import ArticlesPage from "./pages/ArticlesPage";
import { action as logoutAction } from "./pages/Logout";
import { tokenLoader } from "./loaders/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    loader: tokenLoader,
    id: "root",
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "auth",
        element: <AuthenticationPage />,
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
            element: <ArticlesPage />,
            // loader: eventsLoader,
          },
          {
            path: ":articleId",
            id: "article-detail",
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
        action: logoutAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
