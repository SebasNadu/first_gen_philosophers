import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import {
  Input,
  Chip,
  Button,
  Divider,
  Card,
  Skeleton,
  Checkbox,
} from "@nextui-org/react";
import { useMemo } from "react";
import { Toaster, toast } from "sonner";
import { useMutation } from "@apollo/client";
import { GENERATE_PICTURES } from "../graphql/mutations";

const TextEditor = () => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [preTag, setPreTag] = useState("");
  const [tags, setTags] = useState([]);
  const [publicArticle, setPublicArticle] = useState(false);
  const [generatePictures, { loading, error, data }] =
    useMutation(GENERATE_PICTURES);

  const handleTextChange = (text) => {
    setText(text);
  };

  const validateTitle = (title) =>
    title.length > 3 && title.length < 100 && title.match(/^[A-Z]/)
      ? true
      : false;

  const validationState = useMemo(() => {
    if (title === "") return undefined;

    return validateTitle(title) ? "valid" : "invalid";
  }, [title]);

  const handleTagsChange = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const newTag = preTag.trim();
      setTags([...tags, newTag]);
      setPreTag("");
    }
  };

  const handleClose = (tagToRemove) => {
    setTags(tags.filter((fruit) => fruit !== tagToRemove));
    if (tags.length === 1) {
      setTags([]);
    }
  };

  const handleImagesGenerator = () => {
    if (text.length < 10) {
      toast.error("You have to write your article first!");
    }
    generatePictures({
      variables: {
        content: text,
      },
    });
    console.log(data);
  };

  const publicArticleHandler = () => {
    setPublicArticle(!publicArticle);
  };

  return (
    <>
      <form action="">
        <div className="flex">
          <div className="flex-grow">
            <div className="flex items-center gap-4">
              <Input
                required
                value={title}
                type="text"
                label="Title"
                variant="bordered"
                color={validationState === "invalid" ? "danger" : "success"}
                errorMessage={
                  validationState === "invalid" &&
                  "Invalid Title, must be between 3 and 100 characters and start with a capital letter"
                }
                validationState={validationState}
                onValueChange={setTitle}
                className="max-w-xs my-4"
              />
              <Input
                required
                type="text"
                label="Tags"
                variant="bordered"
                className="max-w-[150px]"
                value={preTag}
                onValueChange={setPreTag}
                onKeyDown={handleTagsChange}
              />
              <div className="p-4 grid-rows-3">
                {tags &&
                  tags.map((tag, index) => (
                    <Chip
                      key={index}
                      onClose={() => handleClose(tag)}
                      variant="flat"
                    >
                      {tag}
                    </Chip>
                  ))}
              </div>
              <div className="flex gap-4 ml-auto">
                <Checkbox radius="full" onClick={publicArticleHandler}>
                  Public?
                </Checkbox>
                <Button
                  radius="full"
                  className="bg-gradient-to-tr from-cyan-500 to-lime-400 text-white shadow-lg"
                >
                  Save it!
                </Button>
              </div>
            </div>
            <ReactQuill
              theme="snow"
              value={text}
              onChange={handleTextChange}
              placeholder="Write something..."
            />
          </div>
          <div className="flex flex-grow-0 p-4 ml-4">
            <Divider orientation="vertical" />
            <div className="flex flex-col items-center justify-center ml-4 gap-0">
              <h3>Pick your Article picture!</h3>
              <Card className="w-[200px] space-y-5 p-4 my-2" radius="2xl">
                <Skeleton className="rounded-lg">
                  <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
              </Card>
              <Card className="w-[200px] space-y-5 p-4 my-2" radius="2xl">
                <Skeleton className="rounded-lg">
                  <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
              </Card>
              <Card className="w-[200px] space-y-5 p-4 my-4" radius="2xl">
                <Skeleton className="rounded-lg">
                  <div className="h-24 rounded-lg bg-default-300"></div>
                </Skeleton>
              </Card>
              <Button
                radius="full"
                className="bg-gradient-to-tr from-cyan-500 to-lime-400 text-white shadow-lg"
                onClick={handleImagesGenerator}
              >
                Generate Pictures
              </Button>
            </div>
          </div>
        </div>
      </form>
      <Toaster richColors />
    </>
  );
};

export default TextEditor;
