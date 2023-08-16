import TextEditor from "../components/TextEditor";
import PageContent from "../components/PageContent";

import { Divider } from "@nextui-org/react";
const CreateArticlePage = () => {
  return (
    <>
      <PageContent title={"Create Article Page"}>
        <div>
          <br />
          <Divider />
          <br />
          <TextEditor />
        </div>
      </PageContent>
    </>
  );
};

export default CreateArticlePage;
