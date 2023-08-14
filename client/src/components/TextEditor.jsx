import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { Input } from "@nextui-org/react";
import { useMemo } from "react";

const TextEditor = () => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");

  const handleChange = (text) => {
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

  return (
    <>
      <div>
        <Input
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
          className="max-w-xs"
        />
        <ReactQuill
          theme="snow"
          value={text}
          onChange={handleChange}
          placeholder="Write something..."
        />
      </div>
    </>
  );
};

export default TextEditor;
