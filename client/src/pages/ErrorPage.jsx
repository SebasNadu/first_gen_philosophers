import { useRouteError } from "react-router-dom";

import PageContent from "../components/PageContent";
import Navbar42 from "../components/Navbar";

function ErrorPage() {
  const error = useRouteError();

  let title = "An error occurred!";
  let message = "Something went wrong!";

  if (error.status === 500) {
    message = error.data.message;
  }

  if (error.status === 404) {
    title = "Not found!";
    message = "Could not find resource or page.";
  }

  return (
    <>
      <Navbar42 />
      <PageContent title={title}>
        <p className="text-center">{message}</p>
      </PageContent>
    </>
  );
}

export default ErrorPage;
