import { Spinner } from "@nextui-org/react";

import PageContent from "../components/PageContent";
import CardsCarousel from "../components/CardsCarousel";
import Banner42 from "../components/Banner";
import { useTopsLoader } from "../loaders/loadTopsData";

const list = [
  {
    title: "Orange",
    user: { firstName: "Radu" },
  },
  {
    title: "Tangerine",
    user: { firstName: "Arne" },
  },
  {
    title: "Raspberry",
    user: { firstName: "Miriam" },
  },
  {
    title: "Lemon",
    user: { firstName: "Ramesh" },
  },
  {
    title: "Avocado",
    user: { firstName: "Hongbae" },
  },
  {
    title: "Fox",
    user: { firstName: "Roka" },
  },
  {
    title: "Banana",
    user: { firstName: "Taka" },
  },
  {
    title: "Watermelon",
    user: { firstName: "Attila" },
  },
  {
    title: "Avocado",
    user: { firstName: "Simona" },
  },
  {
    title: "Lemon 2",
    user: { firstName: "Sebastian" },
  },
  {
    title: "Banana",
    user: { firstName: "Arthur" },
  },
  {
    title: "Watermelon",
    user: { firstName: "Billy" },
  },
];

function HomePage() {
  const pageTitle = "Welcome to #FirstGenPhilosophers!";
  const formattedTitle = pageTitle
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const { byLikes, byComments, loading, error } = useTopsLoader();

  return (
    <>
      <Banner42 title={formattedTitle} />
      <PageContent>
        {!loading && !error ? (
          <>
            <h2>Best Articles</h2>
            <CardsCarousel data={byLikes} />
            <h2>Most Popular Articles</h2>
            <CardsCarousel data={byComments} />
            <h2>Best Authors</h2>
            <CardsCarousel data={list} />
            <h1 className="page-title">
              Welcome to{" "}
              <span className="title-text">#FirstGenPhilosophers!</span>
            </h1>
          </>
        ) : (
          <div className="flex justify-center mx-auto">
            <Spinner label="loading" color="success" labelColor="success" />
          </div>
        )}
      </PageContent>
    </>
  );
}

export default HomePage;
