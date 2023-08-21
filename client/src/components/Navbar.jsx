import { useEffect } from "react";
import { useRouteLoaderData, useNavigate, Form } from "react-router-dom";
import { useQuery } from "@apollo/client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Button,
} from "@nextui-org/react";
import { AcmeLogo } from "./FGP_Logo.jsx";
import { SearchIcon } from "./SearchIcon.jsx";
import { Link, NavLink } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { GET_USER_BY_ID } from "../graphql/queries";

export default function Navbar42() {
  const { token, userId } = useRouteLoaderData("root");
  console.log("From Navbar", token, userId);

  const { data, loading, error, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { getUserByIdId: userId },
    skip: !token || !userId,
  });

  const navigate = useNavigate();

  if (error) {
    navigate("/auth");
  }

  return (
    <Navbar
      maxWidth="2xl"
      isBordered
      className="w-screen min-w-screen max-w-screen justify-around"
    >
      <NavbarContent justify="center" className="">
        <NavbarBrand className="mr-4">
          <Link to="/" className="hover:no-underline">
            <AcmeLogo />
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-3">
          <NavbarItem>
            <p color="foreground" href="#" className="text-2xl">
              #FirstGenPhilosophers
            </p>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as="div" justify="end" className="items-center">
        <Input
          classNames={{
            base: "max-w-full md:max-w-[20rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
        />

        {!data && (
          <Button
            radius="full"
            className="bg-gradient-to-tr from-cyan-500 to-lime-400 text-white shadow-lg"
            onClick={() => navigate("/auth?mode=login")}
          >
            Log In
          </Button>
        )}
        {data && (
          <>
            <NavbarItem className="list">
              <NavLink to="articles/create">
                <PlusCircleIcon className="w-8 h-8 hover:text-teal-500 active:text-green-300" />
              </NavLink>
            </NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="success"
                  name={data.getUserById.firstName}
                  size="sm"
                  src={data.getUserById.profilePicture}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <Link to="profile" className="hover:no-underline">
                    <div className="min-w-full min-h-full">
                      <p className="font-semibold">Signed in as</p>
                      <p className="font-semibold">zoey@example.com</p>
                    </div>
                  </Link>
                </DropdownItem>
                <DropdownItem key="MyArticles">My Articles</DropdownItem>
                <DropdownItem key="like">What I Like</DropdownItem>
                <DropdownItem
                  key="discover"
                  onClick={() => navigate("discover")}
                >
                  Discover
                </DropdownItem>
                <DropdownItem key="leaderboard">Leaderboard</DropdownItem>
                <DropdownItem key="logout" color="danger">
                  <Form action="/logout" method="post">
                    <button>Log Out</button>
                  </Form>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
