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
      },
      {
        path: "articles",
        children: [
          {
            index: true,
            element: <ArticlesPage />,
          },
          {
            path: ":articleId",
            id: "article-detail",
            children: [
              {
                index: true,
                element: <ArticleDetailPage />,
              },
              {
                path: "edit",
                element: <EditArticlePage />,
              },
            ],
          },
          {
            path: "create",
            element: <CreateArticlePage />,
          },
        ],
      },
      {
        path: "profile",
        element: <ProfilePage />,
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
