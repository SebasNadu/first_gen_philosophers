import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../reducers/user";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "../graphql/queries";

import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import Navbar42 from "../components/Navbar";
import { getTokenDuration } from "../loaders/auth";
import { Toaster } from "sonner";

function RootLayout() {
  const { token, userId } = useLoaderData();
  const submit = useSubmit();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { getUserByIdId: userId },
    skip: !token || !userId || user,
  });

  useEffect(() => {
    if (!token || !userId) {
      dispatch(setUser(null));
      return;
    }

    if (data && !loading && !error) {
      dispatch(setUser(data.getUserById));
    }

    if (token === "EXPIRED") {
      dispatch(setUser(null));
      submit(null, { action: "/logout", method: "post" });
      return;
    }

    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      dispatch(setUser(null));
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);

    return () => {
      clearTimeout();
    };
  }, [token, userId, submit, dispatch, data, loading, error]);

  return (
    <>
      <Navbar42 />
      <main>
        {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Outlet />
      </main>
      <Toaster richColors />
    </>
  );
}

export default RootLayout;
