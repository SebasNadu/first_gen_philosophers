import {
  Card,
  CardHeader,
  CardFooter,
  Image,
  Button,
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Avatar,
  AvatarGroup,
  Chip,
} from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import fakeImg from "../assets/images/home_banner.jpg";

export default function Card42(props) {
  const {
    title,
    abstract,
    picture,
    id,
    body,
    active,
    user,
    likes,
    comments,
    createdAt,
    tags,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  let newCreatedAt;
  if (createdAt === undefined) {
    newCreatedAt = "No date";
  } else {
    const date = new Date(createdAt);
    const options = { year: "numeric", month: "long", day: "numeric" };
    newCreatedAt = date.toLocaleDateString("de-DE", options);
  }
  const truncateText = (text, maxWords) => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + " ...";
    }
    return text;
  };

  const handleOpen = () => {
    onOpen("blur");
  };

  return (
    <>
      <Card
        isFooterBlurred
        className="w-full h-[300px] col-span-12 sm:col-span-5"
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-start">
          <div className="flex gap-1">
            <p className="text-black text-tiny">By: {user.firstName} | </p>
            <p className="text-black text-tiny">On: {newCreatedAt}</p>
          </div>
          <h4 className="text-black font-medium text-2xl">{title}</h4>
        </CardHeader>
        <div
          className="relative h-full w-full cursor-pointer"
          onClick={handleOpen}
        >
          <Image
            isBlurred
            removeWrapper
            alt="Card example background"
            className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
            src={picture ? picture : fakeImg}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,255,255,0.8)] to-[rgba(0,0,0,0.2)]"></div>
        </div>
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          {likes ? (
            <AvatarGroup isBordered max={3} size="sm">
              {likes.map((like) => (
                <Link key={like.id} to={`/profile/${like.id}`}>
                  <Avatar
                    key={like.id}
                    src={
                      like.profilePicture
                        ? like.profilePicture
                        : "https://i.pravatar.cc/150?u=a042581f4e29026024d"
                    }
                  />
                </Link>
              ))}
            </AvatarGroup>
          ) : (
            <AvatarGroup isBordered max={3} size="sm">
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
            </AvatarGroup>
          )}

          <Button
            className="text-tiny"
            color="success"
            radius="full"
            size="sm"
            onClick={() => navigate(`/articles/${id}`)}
          >
            Read me
          </Button>
        </CardFooter>
      </Card>
      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <div className="flex items-center">
                <div className="flex items-center gap-1 px-8">
                  <Avatar
                    src={
                      user.profilePicture
                        ? user.profilePicture
                        : "https://i.pravatar.cc/150?u=a04258114e29026708c"
                    }
                    size="md"
                  />
                  <Link to={`/profile/${user.id}`}>
                    <p>By {user.firstName}</p>
                  </Link>
                </div>
                <p className="ml-auto px-8">On {newCreatedAt}</p>
              </div>
              {tags && (
                <div className="flex p-2 mx-4 gap-2">
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      radius="full"
                      color="success"
                      variant="bordered"
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
              )}
              <ModalBody>
                <p>{abstract ? abstract : truncateText(body, 100)}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Close
                </Button>
                <Button
                  color="success"
                  onPress={onClose}
                  onClick={() => navigate(`/articles/${id}`)}
                >
                  Read more
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
