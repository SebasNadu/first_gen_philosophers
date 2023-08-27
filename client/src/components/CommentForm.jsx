import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_COMMENT } from "../graphql/mutations";
import { Textarea, Button } from "@nextui-org/react";
import { toast } from "sonner";
import { useRouteLoaderData, useNavigate } from "react-router-dom";

export default function CommentForm({ article, refetch }) {
  const { token } = useRouteLoaderData("root");
  const navigate = useNavigate();

  const [commentValue, setCommentValue] = useState("");
  const [createComment] = useMutation(CREATE_COMMENT);

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
    <>
      {token ? (
        <div className="w-full p-2">
          <form onSubmit={handleCreateComment}>
            <Textarea
              label="Write a comment"
              variant="flat"
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
    </>
  );
}
