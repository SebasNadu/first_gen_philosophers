import TextEditor from "../components/TextEditor";

import { Divider } from "@nextui-org/react";
const CreateArticlePage = () => {
  return (
    <>
      <div className="container mx-auto px-4">
        <div>
          <h1 className="text-center">Create Article</h1>
          <br />
          <Divider />
          <br />
          <TextEditor />
        </div>
        <div></div>
      </div>
    </>
  );
};

export default CreateArticlePage;
