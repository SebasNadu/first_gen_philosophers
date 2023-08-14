import TextEditor from "../components/TextEditor";

import { Divider } from "@nextui-org/react";
const CreateArticlePage = () => {
  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-center">Create Article</h1>
        <br />
        <Divider />
        <br />
        <TextEditor />
      </div>
    </>
  );
};

export default CreateArticlePage;
