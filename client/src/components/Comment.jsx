import { useState, useEffect } from "react";
import { Avatar, Button } from "@nextui-org/react";
import {
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  FOLLOW_USER,
  UNFOLLOW_USER,
} from "../graphql/mutations";
import { useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../reducers/user";

export default function Comments({
  id,
  article,
  comment,
  refetchArticle,
  refetchGetUser,
}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isCommentLiked, setIsCommentLiked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  const [likeComment] = useMutation(LIKE_COMMENT);
  const [unlikeComment] = useMutation(UNLIKE_COMMENT);
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  const navigate = useNavigate();

  useEffect(() => {
    if (comment && user) {
      const isLiked = comment.likes.some((like) => like.id === user.id);
      const isFollowed = user.following.some(
        (follow) => follow.id === comment.user.id,
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
      await refetchArticle({ articleId: article.id });
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
      await refetchArticle({ articleId: article.id });
      const updatedUser = await refetchGetUser({ getUserByIdId: user.id });
      dispatch(setUser(updatedUser.data.getUserById));
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
            {isFollowed ? "Unfollow" : "Follow"}({comment.user.followers.length}
            )
          </Button>
          <Button
            className={
              !isCommentLiked
                ? "mx-1 bg-transparent text-foreground border-default-200"
                : "mx-1"
            }
            color="success"
            radius="full"
            size="sm"
            variant={isCommentLiked ? "solid" : "bordered"}
            onPress={handleLikeComment}
          >
            {isCommentLiked ? "Unlike" : "Like"}({comment.likes.length})
          </Button>
        </div>
      </div>
      <div className="p-2 mb-2">{comment.content}</div>
    </div>
  );
}
