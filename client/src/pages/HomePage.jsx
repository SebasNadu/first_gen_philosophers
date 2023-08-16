import PageContent from "../components/PageContent";
import CardsCarousel from "../components/CardsCarousel";
import Banner42 from "../components/Banner";

const list = [
  {
    title: "Orange",
    img: "/images/fruit-1.jpeg",
    author: "Radu",
  },
  {
    title: "Tangerine",
    img: "/images/fruit-2.jpeg",
    author: "Arne",
  },
  {
    title: "Raspberry",
    img: "/images/fruit-3.jpeg",
    author: "Miriam",
  },
  {
    title: "Lemon",
    img: "/images/fruit-4.jpeg",
    author: "Ramesh",
  },
  {
    title: "Avocado",
    img: "/images/fruit-5.jpeg",
    author: "Hongbae",
  },
  {
    title: "Fox",
    img: "/images/fruit-6.jpeg",
    author: "Roka",
  },
  {
    title: "Banana",
    img: "/images/fruit-7.jpeg",
    author: "Taka",
  },
  {
    title: "Watermelon",
    img: "/images/fruit-8.jpeg",
    author: "Attila",
  },
  {
    title: "Avocado",
    img: "/images/fruit-5.jpeg",
    author: "Simona",
  },
  {
    title: "Lemon 2",
    img: "/images/fruit-6.jpeg",
    author: "Sebastian",
  },
  {
    title: "Banana",
    img: "/images/fruit-7.jpeg",
    author: "Arthur",
  },
  {
    title: "Watermelon",
    img: "/images/fruit-8.jpeg",
    author: "Billy",
  },
];

export default function HomePage() {
  const pageTitle = "Welcome to #FirstGenPhilosophers!";
  const formattedTitle = pageTitle
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return (
    <>
      <Banner42 title={formattedTitle} />
      <PageContent>
        <h2>Top Best Articles</h2>
        <CardsCarousel list={list} />
        <h2>Top Popular Articles</h2>
        <CardsCarousel list={list} />
        <h2>Top Authors</h2>
        <CardsCarousel list={list} />
        <h1 className="page-title">
          Welcome to <span className="title-text">#FirstGenPhilosophers!</span>
        </h1>
      </PageContent>
    </>
  );
}
