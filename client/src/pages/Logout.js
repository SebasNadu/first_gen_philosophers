import { redirect } from "react-router-dom";
import { tokenLoader } from "../loaders/auth";

export function action() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  localStorage.removeItem("userId");
  tokenLoader();
  return redirect("/");
}
