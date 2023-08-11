import ExampleLayout from "../components/exampleLayout";
import ExampleCards from "../components/exampleCards";
import ExampleCard from "../components/exampleCard";
import ExampleImportIcons from "../components/exampleImportIcons";
// important! useState is a hook that allows us to have state in a functional
// we can use it to store the data and update it
import { useState } from "react";
// Button from nextui
import { Button } from "@nextui-org/react";

// fake data for the cards, normally we would fetch this from the backend
const DATA = [
  {
    id: 1,
    title: "This is a fake title",
    description: "some description",
    author: "Frontend Radio",
  },
  {
    id: 2,
    title: "This is a fake title2",
    description: "some description2",
    author: "Frontend Radio2",
  },
  {
    id: 3,
    title: "This is a fake title3",
    description: "some description3",
    author: "Frontend Radio3",
  },
];

export default function ExamplePage() {
  // we create a state variable called cards and a function to update it
  // setCards, we initialize it with an empty array and whet we click on the
  // button we going to call the "backend" in this example we going to use
  // the fake data
  const [cards, setCards] = useState([]);
  const [buttonText, setButtonText] = useState("Search");
  // ExampleLayout is a component that wraps the content of the page,
  // is useful to have a consistent layout across all pages
  //
  // This is another way to create a function, this is called arrow function
  const searchAndSetCards = () => {
    if (cards.length === 0) {
      setCards(DATA);
      setButtonText("Clear");
    } else {
      setCards([]);
      setButtonText("Search");
    }
  };
  return (
    <ExampleLayout>
      <h1 className="text-3xl font-work">Example page</h1>
      <br />
      <p className="text-lg font-workitalic">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
        voluptates,
      </p>
      <ExampleImportIcons />
      {/* search React on change event, there are a lot of events that we can listen to
			and make a function to handle then for example onClick, onChange, onSubmit, etc */}
      <Button
        radius="full"
        className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg mt-4"
        onClick={searchAndSetCards}
      >
        Click me to {buttonText}
      </Button>
      <ExampleCards>
        {/* we use the map function to iterate over the cards array and create a
				ExampleCard component for each item in the array */}
        {cards.map((item) => (
          <ExampleCard
            key={item.id}
            title={item.title}
            description={item.description}
            author={item.author}
          />
        ))}
      </ExampleCards>
    </ExampleLayout>
  );
}
