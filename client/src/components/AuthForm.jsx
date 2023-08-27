import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER, LOGIN_USER } from "../graphql/mutations.js";
import { tokenLoader } from "../loaders/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/user";
import { toast } from "sonner";
// import { setUserId, setToken } from "../reducers/auth";

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

  const dispatch = useDispatch();

  const validateEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  const validatePassword = (password) => password.length >= 5;
  const validateFirstName = (firstName) => firstName.length >= 3;
  const validateLastName = (lastName) => lastName.length >= 3;

  const validationStateCreate = useMemo(() => {
    const emailValidation =
      emailValue === ""
        ? undefined
        : validateEmail(emailValue)
        ? "valid"
        : "invalid";

    const passwordValidation =
      passwordValue === ""
        ? undefined
        : validatePassword(passwordValue)
        ? "valid"
        : "invalid";

    const firstNameValidation =
      firstNameValue === ""
        ? undefined
        : validateFirstName(firstNameValue)
        ? "valid"
        : "invalid";

    const lastNameValidation =
      lastNameValue === ""
        ? undefined
        : validateLastName(lastNameValue)
        ? "valid"
        : "invalid";

    return {
      email: emailValidation,
      password: passwordValidation,
      firstName: firstNameValidation,
      lastName: lastNameValidation,
    };
  }, [emailValue, passwordValue, firstNameValue, lastNameValue]);

  const validationStateLogin = useMemo(() => {
    const emailValidation =
      emailValue === ""
        ? undefined
        : validateEmail(emailValue)
        ? "valid"
        : "invalid";

    const passwordValidation =
      passwordValue === ""
        ? undefined
        : validatePassword(passwordValue)
        ? "valid"
        : "invalid";
    return {
      email: emailValidation,
      password: passwordValidation,
    };
  }, [emailValue, passwordValue]);

  const navigate = useNavigate();

  const [loginUser, { error: errorLogin, loading: loadingLogin }] =
    useMutation(LOGIN_USER);
  const [createUser, { error: errorCreate, loading: loadingCreate }] =
    useMutation(CREATE_USER);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const form = event.target;
      const formData = new FormData(form);

      const userInput = {
        email: formData.get("email"),
        password: formData.get("password"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
      };

      let response;
      if (!isLogin) {
        response = await createUser({
          variables: { userInput },
        });
        if (errorCreate) {
          toast.error(errorCreate.message);
          throw new Error(errorCreate.message);
        }
        if (!loadingCreate && response.data.createUser) {
          toast.success("User created");
          setIsLogin(true);
          return;
        } else {
          toast.error("No response");
          throw new Error("No response");
        }
      } else {
        response = await loginUser({
          variables: userInput,
        });
      }

      if (!response) {
        toast.error("No response");
        throw new Error("No response");
      }
      if (errorLogin) {
        toast.error(errorLogin.message);
        throw new Error(errorLogin.message);
      }

      const { token, user } = response.data.login;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 5);
      localStorage.setItem("expiration", expiration.toISOString());
      dispatch(setUser(user));
      tokenLoader();
      navigate(-1);
    } catch (err) {
      toast.error(err.message);
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
          isLogin ? "w-[360px] h-[340px]" : "w-[360px] h-[460px]"
        }`}
      >
        <CardBody className="overflow-hidden">
          <form method="post" className="" onSubmit={handleSubmit}>
            <h2 className="mb-2">{isLogin ? "Log in" : "Create user"}</h2>
            <div className="flex flex-col gap-5">
              {isLogin ? (
                <>
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
                      !validationStateLogin.email
                        ? ""
                        : validationStateLogin.email === "invalid"
                        ? "danger"
                        : "success"
                    }
                    errorMessage={
                      !validationStateLogin.email
                        ? ""
                        : validationStateLogin.email === "invalid" &&
                          "Please enter a valid email"
                    }
                    validationState={validationStateLogin}
                    onValueChange={setEmailValue}
                  />
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
                      !validationStateLogin.password
                        ? ""
                        : validationStateLogin.password === "invalid"
                        ? "danger"
                        : "success"
                    }
                    errorMessage={
                      !validationStateLogin.password
                        ? ""
                        : validationStateLogin.password === "invalid" &&
                          "Please enter a valid email"
                    }
                    validationState={validationStateLogin}
                    onValueChange={setPasswordValue}
                  />
                </>
              ) : (
                <>
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
                      !validationStateCreate.firstName
                        ? ""
                        : validationStateCreate.firstName === "invalid"
                        ? "danger"
                        : "success"
                    }
                    errorMessage={
                      !validationStateCreate.firstName
                        ? ""
                        : validationStateCreate.firstName === "invalid" &&
                          "Please enter a valid email"
                    }
                    validationState={validationStateCreate}
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
                      !validationStateCreate.lastName
                        ? ""
                        : validationStateCreate.lastName === "invalid"
                        ? "danger"
                        : "success"
                    }
                    errorMessage={
                      !validationStateCreate.lastName
                        ? ""
                        : validationStateCreate.lastName === "invalid" &&
                          "Please enter a valid email"
                    }
                    validationState={validationStateCreate}
                    onValueChange={setLastNameValue}
                  />
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={emailValue}
                    color={
                      !validationStateCreate.email
                        ? ""
                        : validationStateCreate.email === "invalid"
                        ? "danger"
                        : "success"
                    }
                    errorMessage={
                      !validationStateCreate.email
                        ? ""
                        : validationStateCreate.email === "invalid" &&
                          "Please enter a valid email"
                    }
                    validationState={validationStateCreate}
                    onValueChange={setEmailValue}
                  />
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={passwordValue}
                    color={
                      !validationStateCreate.password
                        ? ""
                        : validationStateCreate.password === "invalid"
                        ? "danger"
                        : "success"
                    }
                    errorMessage={
                      !validationStateCreate.password
                        ? ""
                        : validationStateCreate.password === "invalid" &&
                          "Please enter a valid email"
                    }
                    validationState={validationStateCreate}
                    onValueChange={setPasswordValue}
                  />
                </>
              )}
            </div>
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
