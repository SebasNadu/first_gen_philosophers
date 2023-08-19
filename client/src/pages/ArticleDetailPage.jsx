import PageContent from "../components/PageContent";
import { useQuery } from "@apollo/client";
import { GET_ARTICLE_BY_ID } from "../graphql/queries";
import { useParams } from "react-router-dom";
import { Avatar } from "@nextui-org/react";

const ArticleDetailPage = () => {
  const { articleId } = useParams();

  const { data, error, loading } = useQuery(GET_ARTICLE_BY_ID, {
    variables: { getArticleByIdId: articleId },
  });

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    throw error;
  }

  const article = data.getArticleById;

  return (
    <>
      <div className="mx-24 my-8">
        <div className="relative grid grid-cols-12 gap-16">
          <div className="col-span-4 h-[70vh] flex flex-col justify-start">
            <div className="absolute w-[65%]">
              <h1 className="text-9xl uppercase font-extrabold tracking-tighter">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 p-4">
                <Avatar
                  src="https://i.pravatar.cc/150?u=a04258114e29026302d"
                  size="lg"
                />
                <p className="text-4xl font-workitalic">
                  {article.user.firstName && article.user.firstName + " "}
                  {article.user.lastName && article.user.lastName}
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-8 h-[70vh] flex flex-col justify-end">
            <div
              className="w-full bg-cover bg-center bg-no-repeat h-[90%] sm:h-[90%]"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.2)), url(${article.picture})`,
              }}
            ></div>
          </div>
        </div>

        <div className="relative grid grid-cols-12 gap-16 my-8">
          <div className="col-span-4 h-full flex flex-col justify-start"></div>
          <div className="col-span-8 h-full flex flex-col justify-end">
            {article.body && <PageContent>{article.body}</PageContent>}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetailPage;
