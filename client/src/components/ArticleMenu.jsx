import { useState, useEffect } from "react";
import { useRouteLoaderData, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LIKE_ARTICLE,
  UNLIKE_ARTICLE,
  FOLLOW_USER,
  UNFOLLOW_USER,
  CREATE_COMMENT,
} from "../graphql/mutations";
import { GET_USER_BY_ID } from "../graphql/queries";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/user";

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
import { toast } from "sonner";
import Comment from "./Comment";

function ArticleMenu({ article, refetch }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { token, userId } = useRouteLoaderData("root");

  const [isLiked, setIsLiked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [commentValue, setCommentValue] = useState("");

  const navigate = useNavigate();

  const [likeArticle] = useMutation(LIKE_ARTICLE);
  const [unlikeArticle] = useMutation(UNLIKE_ARTICLE);
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [createComment] = useMutation(CREATE_COMMENT);
  const [getUserById, { refetch: refetchGetUser }] =
    useLazyQuery(GET_USER_BY_ID);

  useEffect(() => {
    if (article && user) {
      const isLiked = article.likes.some((like) => like.id === user.id);
      const isFollowed = user.following.some(
        (follow) => follow.id === article.user.id,
      );
      setIsLiked(isLiked);
      setIsFollowed(isFollowed);
    }
  }, [article, user]);

  const handleLikeArticle = async () => {
    if (!token) {
      toast.error("You must be logged in to like a comment");
      navigate("/auth");
      return;
    }
    try {
      if (isLiked) {
        await unlikeArticle({
          variables: { unlikeArticleId: article.id },
        });
        setIsLiked(false);
      } else {
        await likeArticle({
          variables: { likeArticleId: article.id },
        });
        setIsLiked(true);
      }
      await refetch({ articleId: article.id });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleFollowUser = async () => {
    if (!token) {
      toast.error("You must be logged in to follow a user");
      navigate("/auth");
      return;
    }
    if (user.id === article.user.id) {
      toast.error("You cannot follow yourself");
      return;
    }
    try {
      if (isFollowed) {
        await unfollowUser({
          variables: { unfollowUserId: article.user.id },
        });
        setIsFollowed(false);
      } else {
        await followUser({
          variables: { followUserId: article.user.id },
        });
        setIsFollowed(true);
      }
      await refetch({ articleId: article.id });
      const updatedUser = await getUserById({
        variables: { getUserByIdId: user.id },
      });
      dispatch(setUser(updatedUser.data.getUserById));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      await createComment({
        variables: {
          commentInput: {
            articleId: article.id,
            content: commentValue,
          },
        },
      });
      await refetch({ articleId: article.id });
      setCommentValue("");
    } catch (err) {
      toast.error(err.message);
    }
  };

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
              onPress={handleFollowUser}
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
                <Comment
                  key={index}
                  article={article}
                  comment={comment}
                  refetchArticle={refetch}
                  refetchGetUser={refetchGetUser}
                />
              ))}
            </AccordionItem>
            <AccordionItem
              aria-label="Comment Form"
              title="Write a Comment"
              classNames={{
                title: "text-medium",
              }}
            >
              {user ? (
                <div className="w-full p-2">
                  <form onSubmit={handleCreateComment}>
                    <Textarea
                      label="Write a comment"
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="Enter your comment here"
                      className="max-w-full"
                      classNames={{
                        label: "hidden",
                      }}
                      name="comment"
                      required
                      id="comment"
                      value={commentValue}
                      onValueChange={setCommentValue}
                    />
                    <Button
                      color="success"
                      radius="full"
                      size="md"
                      fullWidth
                      variant="ghost"
                      className="mt-2"
                      type="submit"
                    >
                      Send
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 p-2">
                  <h6 className="text-default-400 text-small">
                    You must be logged in to comment
                  </h6>
                  <Button
                    color="success"
                    radius="full"
                    size="md"
                    variant="faded"
                    onPress={() => navigate("/auth")}
                    className="mt-2"
                  >
                    Login
                  </Button>
                </div>
              )}
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
              onPress={handleLikeArticle}
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
