import { json, redirect } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { CREATE_USER, LOGIN_USER } from "../graphql/mutations";

export default async function useAuthAction({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unsupported mode." }, { status: 422 });
  }

  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
    firstName: data.get("firstName"),
    lastName: data.get("lastName"),
  };

  let mutation;
  if (mode === "signup") {
    mutation = CREATE_USER;
  } else {
    mutation = LOGIN_USER;
  }

  const [performMutation, { loading, error, data: mutationData }] =
    useMutation(mutation);

  try {
    const mutationResponse = await performMutation({
      variables: authData,
    });

    const token =
      mode === "signup"
        ? mutationResponse.data.createUser.token
        : mutationResponse.data.login.token;
    const userId =
      mode === "signup"
        ? mutationResponse.data.createUser.userId
        : mutationResponse.data.login.userId;

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 5);
    localStorage.setItem("expiration", expiration.toISOString());

    return redirect("/");
  } catch (error) {
    console.log(error);
    throw error;
  }
}
