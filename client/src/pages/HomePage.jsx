import React from "react";
import PageContent from "../components/PageContent";
import {
  Card, 
  CardBody, 
  CardFooter, 
  Image, 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  Button
} from "@nextui-org/react";


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
      <PageContent title={formattedTitle}>
    <div className="gap-1 grid grid-cols-2 sm:grid-cols-4">
      {list.map((item, index) => (
          <React.Fragment key={index}>
          {index % 4 === 0 && (
            <div className="col-span-4">
              <h2 className="text-2xl font-bold mb-2">Header Title<br/></h2>
            </div>
          )}
          <div className="col-span-1">
          <Popover
                showArrow
                backdrop="opaque"
                placement="right"
                classNames={{
                  base: "py-3 px-4 border border-default-200 bg-gradient-to-br from-white to-default-300 dark:from-default-100 dark:to-default-50",
                  arrow: "bg-default-200",
                }}
              >
                <PopoverTrigger>
          <Card
            shadow="sm"
            isPressable
            onPress={() => console.log("item pressed")}
            className="card-container"
          >
            <CardBody className="overflow-visible p-0">
                <Image
                  shadow="sm"
                  radius="lg"
                  width="100%"
                  alt={item.title}
                  className="w-full object-cover card-image"
                  src={item.img}
                />
              </CardBody>
              <CardFooter className="text-small justify-between">
                <b>{item.title}</b>
                <p className="text-default-500 author"> {item.author}</p> {/* Change "price" to "author" */}
              </CardFooter>
        
          
            </Card>
            </PopoverTrigger>
                <PopoverContent>
                  {(titleProps) => (
                    <div className="px-1 py-2">
                      <h3 className="text-small font-bold" {...titleProps}>
                        {item.title} Abstract
                      </h3>
                      <div className="text-tiny">This is the {item.title} abstract</div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </React.Fragment>
        ))}
      </div>
      <h1 className="page-title">
        Welcome to <span className="title-text">#FirstGenPhilosophers!</span>
      </h1>
    </PageContent>
  );
}
