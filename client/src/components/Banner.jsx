import { useQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "../graphql/queries";
import backgroundImage from "../assets/images/home_banner1.jpg";
import { useRouteLoaderData } from "react-router-dom";

const Banner42 = (props) => {
  const { token, userId } = useRouteLoaderData("root");
  const title = props.title.split("#");

  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { getUserByIdId: userId },
    skip: !token || !userId,
  });

  return (
    <section
      className="w-screen flex flex-col justify-center bg-cover bg-center bg-no-repeat h-[30vh] sm:h-[45vh]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="mx-auto max-w-screen px-4">
        <div className="max-h-full mt-30 max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            {title[0]}
            <strong className="block font-extrabold text-green-500">
              #{title[1]}
            </strong>
          </h1>

          <p className="mt-4 max-w-lg sm:text-xl/relaxed">
            {data
              ? `It is nice to have you back, ${data.getUserById.firstName}!`
              : "An space for first generation philosophers to share their thoughts and ideas."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner42;
