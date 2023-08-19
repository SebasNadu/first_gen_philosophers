import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Chip,
  Button,
  Divider,
  Card,
  Skeleton,
  Switch,
} from "@nextui-org/react";
import { Toaster, toast } from "sonner";
import { useMutation } from "@apollo/client";
import { GENERATE_PICTURES, CREATE_ARTICLE } from "../graphql/mutations";

const TextEditor = () => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [preTag, setPreTag] = useState("");
  const [tags, setTags] = useState([]);
  const [publicArticle, setPublicArticle] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);

  const [
    generatePictures,
    { loading: loadingPictures, error: errorPictures, data: dataPictures },
  ] = useMutation(GENERATE_PICTURES);

  const [
    createArticle,
    { loading: loadingArticle, error: errorArticle, data: dataArticle },
  ] = useMutation(CREATE_ARTICLE);

  const navigate = useNavigate();

  const handleTextChange = (text) => {
    setText(text);
  };

  const handleTagsChange = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const newTag = preTag.trim();
      setTags([...tags, newTag]);
      setPreTag("");
    }
  };

  const handleClose = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    if (tags.length === 1) {
      setTags([]);
    }
  };

  const publicArticleHandler = () => {
    setPublicArticle(!publicArticle);
  };

  const handleImagesGenerator = async () => {
    if (text.length < 10) {
      toast.error("You have to write your article first!");
      return;
    }

    try {
      const response = await generatePictures({
        variables: {
          content: text,
        },
        skip: text.length < 10,
      });
      if (!response) {
        throw new Error("No response from server");
      }
      if (errorPictures) {
        throw new Error(errorPictures);
      }
      const generatedPictures = response.data.generatePictures;
      if (generatedPictures) {
        setPictures(generatedPictures);
      }
    } catch (error) {
      console.error("Error generating pictures:", error);
      toast.error("Error generating pictures");
    }
  };

  const validateTitle = (title) =>
    title.length > 3 && title.length < 100 && title.match(/^[A-Z]/)
      ? true
      : false;
  const validateText = (text) => (text.length > 10 ? true : false);
  const validateCardSelection = (selectedCardIndex) =>
    selectedCardIndex !== null ? true : false;

  const validationState = useMemo(() => {
    return {
      title:
        title === "" ? undefined : validateTitle(title) ? "valid" : "invalid",
      text: text === "" ? undefined : validateText(text) ? "valid" : "invalid",
      cardSelection:
        pictures.length === 0
          ? undefined
          : validateCardSelection(selectedCardIndex)
          ? "valid"
          : "invalid",
      tags: tags.length === 0 ? undefined : "valid",
    };
  }, [title, text, pictures, selectedCardIndex, tags]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await createArticle({
        variables: {
          title,
          body: text,
          tags,
          active: publicArticle,
          picture: pictures[selectedCardIndex],
        },
      });
      if (!response) {
        throw new Error("No response from server");
      }
      if (errorArticle) {
        throw new Error(errorArticle);
      }
      const createdArticle = response.data.createArticle;
      if (!createdArticle) {
        throw new Error("No response from server");
      }
      toast.success("Article created successfully");
      navigate(`/articles/${createdArticle.id}`);
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error("Error creating article");
    }
  };

  return (
    <>
      <form method="post" onSubmit={handleSubmit}>
        <div className="flex">
          <div className="flex-grow">
            <div className="flex items-center gap-4">
              <Input
                required
                value={title}
                type="text"
                label="Title"
                variant="bordered"
                color={
                  !validationState.title
                    ? ""
                    : validationState.title === "invalid"
                    ? "danger"
                    : "success"
                }
                errorMessage={
                  !validationState.title
                    ? ""
                    : validationState.title === "invalid" &&
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
              <div className="flex items-center gap-4 ml-auto">
                <p>Public?</p>
                <Switch
                  selected={publicArticle}
                  aria-label="Public?"
                  onClick={publicArticleHandler}
                  color="success"
                />
                <Button
                  radius="full"
                  className="bg-gradient-to-tr from-cyan-500 to-lime-400 text-white shadow-lg"
                  type="submit"
                  isLoading={loadingArticle}
                  spinner={
                    <svg
                      className="animate-spin h-5 w-5 text-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      />
                    </svg>
                  }
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
              {loadingPictures ? (
                <>
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
                </>
              ) : (
                pictures.map((url, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer w-[200px] space-y-5 p-4 my-2 ${
                      selectedCardIndex === index
                        ? "border border-lime-400"
                        : ""
                    }`}
                    radius="2xl"
                  >
                    <img
                      src={url}
                      alt={`Image ${index}`}
                      onClick={() => setSelectedCardIndex(index)}
                    />
                  </Card>
                ))
              )}
              <Button
                radius="full"
                className="bg-gradient-to-tr from-cyan-500 to-lime-400 text-white shadow-lg my-4"
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
