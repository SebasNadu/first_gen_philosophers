import { useEffect } from "react";
import { useSelector } from "react-redux";

import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import Navbar42 from "../components/Navbar";
import { getTokenDuration } from "../loaders/auth";

function RootLayout() {
  const { token, userId } = useLoaderData();
  const submit = useSubmit();
  console.log("From Root", token, userId);

  useEffect(() => {
    if (!token) {
      return;
    }
    if (!userId) {
      return;
    }

    if (token === "EXPIRED") {
      submit(null, { action: "/logout", method: "post" });
      return;
    }

    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);

    return () => {
      clearTimeout();
    };
  }, [token, userId, submit]);

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
