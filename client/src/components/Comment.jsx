import { useState, useEffect } from "react";
import { Avatar, Button } from "@nextui-org/react";
import { LIKE_COMMENT, UNLIKE_COMMENT } from "../graphql/mutations";
import { useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Comments({ id, article, comment, refetch }) {
  const user = useSelector((state) => state.user.user);
  const [isCommentLiked, setIsCommentLiked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  const [likeComment] = useMutation(LIKE_COMMENT);
  const [unlikeComment] = useMutation(UNLIKE_COMMENT);

  const navigate = useNavigate();

  useEffect(() => {
    if (comment && user) {
      const isLiked = comment.likes.some((like) => like.id === user.id);
      const isFollowed = user.following.some(
        (follow) => follow.id === comment.user.id
      );
      setIsCommentLiked(isLiked);
      setIsFollowed(isFollowed);
    }
  }, [comment, user]);

  const handleLikeComment = async () => {
    if (!user) {
      toast.error("You must be logged in to like a comment");
      navigate("/auth");
      return;
    }
    try {
      if (isCommentLiked) {
        await unlikeComment({
          variables: {
            unlikeCommentId: comment.id,
          },
        });
      } else {
        await likeComment({
          variables: {
            likeCommentId: comment.id,
          },
        });
      }
      await refetch({ articleId: article.id });
    } catch (error) {
      toast.error("Something went wrong");
      toast.error(error.message);
    }
  };

  const handleFollowUser = async () => {
    if (!user) {
      toast.error("You must be logged in to follow a user");
      navigate("/auth");
      return;
    }
    if (user.id === comment.user.id) {
      toast.error("You cannot follow yourself");
      return;
    }
    try {
      if (isFollowed) {
        await unfollowUser({
          variables: {
            unfollowUserId: comment.user.id,
          },
        });
      } else {
        await followUser({
          variables: {
            followUserId: comment.user.id,
          },
        });
      }
      await refetch({ articleId: article.id });
    } catch (error) {
      toast.error("Something went wrong");
      toast.error(error.message);
    }
  };

  return (
    <div key={id} className="bg-zinc-100 rounded-lg">
      <div className="flex items-center justify-between mx-2 mb-2 p-2">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={comment.user.profilePicture}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {comment.user.firstName}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              View Profile
            </h5>
          </div>
        </div>
        <div>
          <Button
            className={
              !comment.user.followers.some((follow) => follow.id === user.id)
                ? "mx-1 bg-transparent text-foreground border-default-200"
                : "mx-1"
            }
            color="success"
            radius="full"
            size="sm"
            variant={
              comment.user.followers.some((follow) => follow.id === user.id)
                ? "solid"
                : "bordered"
            }
            onPress={handleFollowUser}
          >
            {comment.user.followers.some((follow) => follow.id === user.id)
              ? "Unfollow"
              : "Follow"}
            ({comment.user.followers.length})
          </Button>
          <Button
            className={
              !comment.likes.some((like) => like.id === user.id)
                ? "mx-1 bg-transparent text-foreground border-default-200"
                : "mx-1"
            }
            color="success"
            radius="full"
            size="sm"
            variant={
              comment.likes.some((like) => like.id === user.id)
                ? "solid"
                : "bordered"
            }
            onPress={handleLikeComment}
          >
            {comment.likes.some((like) => like.id === user.id)
              ? "Unlike"
              : "Like"}
            ({comment.likes.length})
          </Button>
        </div>
      </div>
      <div className="p-2 mb-2">{comment.content}</div>
    </div>
  );
}
