import PageContent from "../components/PageContent";
import { useQuery } from "@apollo/client";
import { GET_ARTICLE_BY_ID } from "../graphql/queries";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
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
import { useRouteLoaderData } from "react-router-dom";

const ArticleDetailPage = () => {
  const { articleId } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const { userId } = useRouteLoaderData("root");

  const { data, error, loading } = useQuery(GET_ARTICLE_BY_ID, {
    variables: { getArticleByIdId: articleId },
  });

  useEffect(() => {
    if (data) {
      if (data.getArticleById.likes.includes(userId)) {
        setIsLiked(true);
      }
      if (data.getArticleById.user.followers.includes(userId)) {
        setIsFollowed(true);
      }
    }
  }, [data, userId]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    throw error;
  }

  const article = data.getArticleById;
  const date = new Date(article.createdAt);
  const articleDate = date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="mx-24 my-8">
        <div className="grid grid-cols-12 gap-16">
          <div className="col-span-4 h-[70vh]">
            <div className="absolute w-[60%] h-[90%] overflow-hidden">
              <h1 className="text-9xl uppercase font-extrabold tracking-tighter">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 p-4">
                <Avatar src={article.user.profilePicture} size="lg" />
                <p className="text-4xl font-workitalic">
                  {article.user.firstName && article.user.firstName + " "}
                  {article.user.lastName && article.user.lastName}
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-8 h-[70vh] flex flex-col justify-end">
            <div
              className="w-full bg-cover bg-center bg-no-repeat h-[90%] sm:h-[90%]"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.2)), url(${article.picture})`,
              }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-16 my-4">
          <div className="relative col-span-4 h-full flex flex-col justify-start my-20">
            <div className="sticky">
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
                      title="Add a Comment"
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
                          <Avatar
                            key={index}
                            src={like.profilePicture}
                            size="sm"
                          />
                        ))}
                    </AvatarGroup>
                    {article.likes.length === 0 && (
                      <>
                        <p className="font-semibold text-default-400 text-small">
                          0
                        </p>
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
          </div>
          <div className="col-span-8 h-full flex flex-col justify-start">
            <p>{articleDate}</p>
            {article.body && <PageContent>{article.body}</PageContent>}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetailPage;
