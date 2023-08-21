import { useState, useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";
import {
  Avatar,
  Card,
  CardHeader,
  Divider,
  CardBody,
  CardFooter,
  Button,
  AvatarGroup,
  Accordion,
  AccordionItem,
  Textarea,
} from "@nextui-org/react";

function ArticleMenu({ article }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const { userId } = useRouteLoaderData("root");

  useEffect(() => {
    if (article) {
      if (article.likes.includes(userId)) {
        setIsLiked(true);
      }
      if (article.user.followers.includes(userId)) {
        setIsFollowed(true);
      }
    }
  }, [article, userId]);

  return (
    <div className="sticky top-1/2 transform -translate-y-0">
      <Card className="max-w-full m-4">
        <CardHeader className="justify-between p-6">
          <div className="flex gap-5">
            <Avatar
              isBordered
              radius="full"
              size="md"
              src={article.user.profilePicture}
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">
                {article.user.firstName && article.user.firstName}
              </h4>
              <h5 className="text-small tracking-tight text-default-400 leading-3">
                View Profile
              </h5>
            </div>
          </div>
          <div>
            <Button
              className={
                !isFollowed
                  ? "mx-1 bg-transparent text-foreground border-default-200"
                  : "mx-1"
              }
              color="success"
              radius="full"
              size="sm"
              variant={isFollowed ? "solid" : "bordered"}
              onPress={() => setIsFollowed(!isFollowed)}
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </Button>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex justify-between items-center">
            <h6>{article.title}</h6>
          </div>
          <Accordion variant="bordered" className="mt-4">
            <AccordionItem
              aria-label="Comments"
              title="Read Comments"
              subtitle={`(${article.comments.length}) comments`}
              classNames={{
                title: "text-medium",
              }}
            >
              {article.comments.map((comment, index) => (
                <div key={index}>
                  <div className="flex justify-between mx-1">
                    <div className="flex gap-5">
                      <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={comment.user.profilePicture}
                      />
                      <div className="flex flex-col gap-1 items-start justify-center">
                        <h4 className="text-small font-semibold leading-none text-default-600">
                          {comment.user && comment.user.firstName}
                        </h4>
                        <h5 className="text-small tracking-tight text-default-400">
                          View Profile
                        </h5>
                      </div>
                    </div>
                    <div>
                      <Button
                        className={
                          !isFollowed
                            ? "mx-1 bg-transparent text-foreground border-default-200"
                            : "mx-1"
                        }
                        color="success"
                        radius="full"
                        size="sm"
                        variant={isFollowed ? "solid" : "bordered"}
                        onPress={() => setIsFollowed(!isFollowed)}
                      >
                        {isFollowed ? "Unfollow" : "Follow"}
                      </Button>
                      <Button
                        className={
                          !isLiked
                            ? "mx-1 bg-transparent text-foreground border-default-200"
                            : "mx-1"
                        }
                        color="success"
                        radius="full"
                        size="sm"
                        variant={isLiked ? "solid" : "bordered"}
                        onPress={() => setIsLiked(!isLiked)}
                      >
                        {isLiked ? "Unlike" : "Like"}
                      </Button>
                    </div>
                  </div>
                  <div className="p-2 mb-2">{comment.content}</div>
                  <Divider className="mb-4" />
                </div>
              ))}
            </AccordionItem>
            <AccordionItem
              aria-label="Comment Form"
              title="Write a Comment"
              classNames={{
                title: "text-medium",
              }}
            >
              <div className="w-full p-2">
                <Textarea
                  label="Write a comment"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="Enter your comment here"
                  className="max-w-full"
                  classNames={{
                    label: "hidden",
                  }}
                />
                <Button
                  color="success"
                  radius="full"
                  size="md"
                  fullWidth
                  variant="ghost"
                  onPress={() => setIsLiked(!isLiked)}
                  className="mt-2"
                >
                  Send
                </Button>
              </div>
            </AccordionItem>
          </Accordion>
        </CardBody>
        <Divider />
        <CardFooter className="flex items-center justify-center gap-3">
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">
              {article.user.following && article.user.following.length}
            </p>
            <p className=" text-default-400 text-small">Following</p>
          </div>
          <div className="flex gap-1">
            <p className="font-semibold text-default-400 text-small">
              {article.user.followers && article.user.followers.length}
            </p>
            <p className="text-default-400 text-small">Followers</p>
          </div>
          <div className="flex gap-1">
            <AvatarGroup isBordered max={3}>
              {article.likes &&
                article.likes.map((like, index) => (
                  <Avatar key={index} src={like.profilePicture} size="sm" />
                ))}
            </AvatarGroup>
            {article.likes.length === 0 && (
              <>
                <p className="font-semibold text-default-400 text-small">0</p>
                <p className="text-default-400 text-small">Likes</p>
              </>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              className={
                !isLiked
                  ? "mx-1 bg-transparent text-foreground border-default-200"
                  : "mx-1"
              }
              color="success"
              radius="full"
              size="sm"
              variant={isLiked ? "solid" : "bordered"}
              onPress={() => setIsLiked(!isLiked)}
            >
              {isLiked ? "Unlike article" : "Like article"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ArticleMenu;
