// import all from nextui
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

export default function ExampleCard(props) {
  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">{props.author}</p>
        <small className="text-default-500">{props.description}</small>
        <h4 className="font-bold text-large">{props.title}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src="/src/assets/images/duck.jpg"
          width={270}
        />
      </CardBody>
    </Card>
  );
}
