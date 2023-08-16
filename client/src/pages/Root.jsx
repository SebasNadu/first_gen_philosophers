// import { useEffect } from "react";
import { Outlet, useLoaderData, useSubmit } from "react-router-dom";

import Navbar42 from "../components/Navbar";
// import { getTokenDuration } from "../utils/auth";

function RootLayout() {
  // const token = useLoaderData();
  // const submit = useSubmit();
  // // const navigation = useNavigation();
  // useEffect(() => {
  //   if (!token) {
  //     return;
  //   }
  //
  //   if (token === "EXPIRED") {
  //     submit(null, { action: "/logout", method: "post" });
  //     return;
  //   }
  //
  //   const tokenDuration = getTokenDuration();
  //
  //   setTimeout(() => {
  //     submit(null, { action: "/logout", method: "post" });
  //   }, tokenDuration);
  // }, [token, submit]);

  return (
    <>
      <Navbar42 />
      <div className="container mx-auto">
        <main>
          {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default RootLayout;
