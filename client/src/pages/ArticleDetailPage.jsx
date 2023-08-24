import PageContent from "../components/PageContent";
import { useQuery } from "@apollo/client";
import { GET_ARTICLE_BY_ID } from "../graphql/queries";
import { useParams } from "react-router-dom";
import { Avatar } from "@nextui-org/react";
import ArticleMenu from "../components/ArticleMenu";
import { Spinner } from "@nextui-org/react";

const ArticleDetailPage = () => {
  const { articleId } = useParams();

  const { data, error, loading, refetch } = useQuery(GET_ARTICLE_BY_ID, {
    variables: { getArticleByIdId: articleId },
  });

  if (loading) {
    return (
      <div className="flex justify-center mx-auto">
        <Spinner label="loading" color="success" labelColor="success" />
      </div>
    );
  }
  if (error) {
    throw error;
  }

  const article = data.getArticleById;
  const date = new Date(article.createdAt);
  const articleDate = date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="mx-24 my-8">
        <div className="grid grid-cols-12 gap-16">
          <div className="col-span-4 h-[70vh]">
            <div className="absolute w-[80%] lg:w-[60%] h-[90%] overflow-hidden">
              <h1 className="text-7xl lg:text-8xl uppercase font-extrabold tracking-tighter">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 p-4">
                <Avatar src={article.user.profilePicture} size="lg" />
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

        <div className="grid grid-cols-12 gap-16 my-4">
          <div className="relative col-span-4 h-full flex flex-col justify-start my-20">
            <ArticleMenu article={article} refetch={refetch} />
          </div>
          <div className="col-span-8 h-full flex flex-col justify-start">
            <p>{articleDate}</p>
            {article.abstract && (
              <div className="mt-4 flex justify-center items-center">
                <blockquote className="bg-slate-50 rounded-xl p-6 pb-3 shadow w-[95%]">
                  <span className="text-4xl leading-3 font-bold">“</span>
                  {` ${article.abstract} `}
                  <span className="text-4xl leading-3 font-bold">„</span>
                  <p className="font-workitalic text-end">- FirstGenAI -</p>
                </blockquote>
              </div>
            )}
            {article.body && (
              <PageContent>
                <div
                  className="flex flex-col gap-5"
                  dangerouslySetInnerHTML={{ __html: article.body }}
                ></div>
              </PageContent>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleDetailPage;
