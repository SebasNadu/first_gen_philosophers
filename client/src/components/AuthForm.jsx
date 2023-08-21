import { useNavigate, redirect } from "react-router-dom";
import { useState, useMemo } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER, LOGIN_USER } from "../graphql/mutations.js";
import { tokenLoader } from "../loaders/auth";

import { Button, Input, Card, CardBody } from "@nextui-org/react";
import { MailIcon } from "./MailIcon.jsx";
import { LockIcon } from "./LockIcon.jsx";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [firstNameValue, setFirstNameValue] = useState("");
  const [lastNameValue, setLastNameValue] = useState("");

  const validateEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  const validatePassword = (password) => password.length >= 5;
  const validateFirstName = (firstName) => firstName.length >= 3;
  const validateLastName = (lastName) => lastName.length >= 3;

  const validationState = useMemo(() => {
    return {
      email:
        emailValue === ""
          ? undefined
          : validateEmail(emailValue)
          ? "valid"
          : "invalid",
      password:
        passwordValue === ""
          ? undefined
          : validatePassword(passwordValue)
          ? "valid"
          : "invalid",
      firstName:
        firstNameValue === ""
          ? undefined
          : validateFirstName(firstNameValue)
          ? "valid"
          : "invalid",
      lastName:
        lastNameValue === ""
          ? undefined
          : validateLastName(lastNameValue)
          ? "valid"
          : "invalid",
    };
  }, [emailValue, passwordValue, firstNameValue, lastNameValue]);

  const navigate = useNavigate();

  const [performMutation, { loading, error, data: mutationData }] = useMutation(
    isLogin ? LOGIN_USER : CREATE_USER
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const form = event.target;
      const formData = new FormData(form);

      const authData = {
        email: formData.get("email"),
        password: formData.get("password"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
      };

      const response = await performMutation({
        variables: authData,
      });
      if (!response) {
        throw new Error("No response");
      }
      if (error) {
        throw new Error(error);
      }

      const token = !isLogin
        ? response.data.createUser.token
        : response.data.login.token;
      const userId = !isLogin
        ? response.data.createUser.userId
        : response.data.login.userId;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 5);
      localStorage.setItem("expiration", expiration.toISOString());
      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className="flex justify-center items-center flex-col w-full">
      <Card
        className={`max-w-full ${
          isLogin ? "w-[360px] h-[340px]" : "w-[360px] h-[440px]"
        }`}
      >
        <CardBody className="overflow-hidden">
          <form method="post" className="" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500">
                {error.message} {/* Display the error message */}
              </div>
            )}
            <h2 className="mb-2">{isLogin ? "Log in" : "Create user"}</h2>
            {isLogin ? (
              <div className="flex flex-col gap-5">
                <label htmlFor="email" hidden>
                  Email
                </label>
                <Input
                  autoFocus
                  endContent={
                    <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={emailValue}
                  color={
                    !validationState.email
                      ? ""
                      : validationState.email === "invalid"
                      ? "danger"
                      : "success"
                  }
                  errorMessage={
                    !validationState.email
                      ? ""
                      : validationState.email === "invalid" &&
                        "Please enter a valid email"
                  }
                  validationState={validationState}
                  onValueChange={setEmailValue}
                />
                <label htmlFor="password" hidden>
                  Password
                </label>
                <Input
                  endContent={
                    <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  label="Password"
                  placeholder="Enter your password"
                  variant="bordered"
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={passwordValue}
                  color={
                    !validationState.password
                      ? ""
                      : validationState.password === "invalid"
                      ? "danger"
                      : "success"
                  }
                  errorMessage={
                    !validationState.password
                      ? ""
                      : validationState.password === "invalid" &&
                        "Please enter a valid email"
                  }
                  validationState={validationState}
                  onValueChange={setPasswordValue}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Input
                  isRequired
                  label="First Name"
                  placeholder="Enter your name"
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={firstNameValue}
                  color={
                    !validationState.firstName
                      ? ""
                      : validationState.firstName === "invalid"
                      ? "danger"
                      : "success"
                  }
                  errorMessage={
                    !validationState.firstName
                      ? ""
                      : validationState.firstName === "invalid" &&
                        "Please enter a valid email"
                  }
                  validationState={validationState}
                  onValueChange={setFirstNameValue}
                />
                <Input
                  isRequired
                  label="Last Name"
                  placeholder="Enter your name"
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={lastNameValue}
                  color={
                    !validationState.lastName
                      ? ""
                      : validationState.lastName === "invalid"
                      ? "danger"
                      : "success"
                  }
                  errorMessage={
                    !validationState.lastName
                      ? ""
                      : validationState.lastName === "invalid" &&
                        "Please enter a valid email"
                  }
                  validationState={validationState}
                  onValueChange={setLastNameValue}
                />
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={passwordValue}
                  color={
                    !validationState.password
                      ? ""
                      : validationState.password === "invalid"
                      ? "danger"
                      : "success"
                  }
                  errorMessage={
                    !validationState.password
                      ? ""
                      : validationState.password === "invalid" &&
                        "Please enter a valid email"
                  }
                  validationState={validationState}
                  onValueChange={setPasswordValue}
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your name"
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={passwordValue}
                  color={
                    !validationState.password
                      ? ""
                      : validationState.password === "invalid"
                      ? "danger"
                      : "success"
                  }
                  errorMessage={
                    !validationState.password
                      ? ""
                      : validationState.password === "invalid" &&
                        "Please enter a valid email"
                  }
                  validationState={validationState}
                  onValueChange={setPasswordValue}
                />
              </div>
            )}
            <div className="flex justify-evenly items-center p-6">
              <Button color="success" variant="ghost" onClick={toggleAuthMode}>
                {isLogin ? "Create user" : "Login"}
              </Button>
              <Button
                className="bg-gradient-to-tr from-cyan-500 to-lime-400 text-white shadow-lg"
                type="submit"
                isLoading={isSubmitting}
                spinner={
                  <svg
                    className="animate-spin h-5 w-5 text-current"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      fill="currentColor"
                    />
                  </svg>
                }
              >
                {isSubmitting ? "Submitting..." : "Save"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AuthForm;
