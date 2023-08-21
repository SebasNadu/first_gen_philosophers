import { useMutation } from "@apollo/client";
import { CREATE_USER, LOGIN_USER } from "../graphql/mutations.js";
import { redirect, json } from "react-router-dom";

export async function action({ request }) {
  console.log("request", request);
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unsupported mode." }, { status: 422 });
  }

  const [performMutation, { loading, error, data: mutationData }] = useMutation(
    mode === "login" ? LOGIN_USER : CREATE_USER
  );

  try {
    const data = await request.formData();
    const authData = {
      email: data.get("email"),
      password: data.get("password"),
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
    };
    console.log("authData", authData);

    const response = await performMutation({
      variables: authData,
    });
    if (!response) {
      throw new Error("No response");
    }
    if (error) {
      throw error;
    }

    const token =
      mode !== "login"
        ? response.data.createUser.token
        : response.data.login.token;
    const userId =
      mode !== "login"
        ? response.data.createUser.userId
        : response.data.login.userId;

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 5);
    localStorage.setItem("expiration", expiration.toISOString());

    return redirect("/");
  } catch (err) {
    console.log(err);
    return json(
      { message: "Something went wrong in the Auth." },
      { status: 500 }
    );
  }
}
