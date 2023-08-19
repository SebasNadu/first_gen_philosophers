import { useEffect } from "react";
import { Outlet, useLoaderData, useSubmit } from "react-router-dom";

import Navbar42 from "../components/Navbar";
import { getTokenDuration } from "../loaders/auth";

function RootLayout() {
  const { token, userId } = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    if (!token) {
      return;
    }

    // if (token === "EXPIRED") {
    //   submit(null, { action: "/logout", method: "post" });
    //   return;
    // }

    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);
  }, [token, submit]);

  return (
    <>
      <Navbar42 />
      <main>
        {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
