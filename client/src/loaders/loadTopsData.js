import { useQuery } from "@apollo/client";
import {
  GET_TOPS_BY_LIKES,
  GET_TOPS_BY_COMMENTS,
  GET_ARTICLES,
} from "../graphql/queries";

export function useTopsLoader() {
  const {
    loading: loadingByLikes,
    error: errorByLikes,
    data: dataByLikes,
  } = useQuery(GET_TOPS_BY_LIKES, {
    variables: { total: 10 },
  });

  const {
    loading: loadingByComments,
    error: errorByComments,
    data: dataByComments,
  } = useQuery(GET_TOPS_BY_COMMENTS, {
    variables: { total: 10 },
  });

  const {
    loading: loadingArticles,
    error: errorArticles,
    data: dataArticles,
  } = useQuery(GET_ARTICLES, {
    variables: { total: 20 },
  });

  const byLikes = dataByLikes ? dataByLikes.getTopArticlesByLikes : null;
  const byComments = dataByComments
    ? dataByComments.getTopArticlesByComments
    : null;
  const articles = dataArticles ? dataArticles.getArticles : null;
  const error = errorByLikes || errorByComments || errorArticles;
  const loading = loadingByLikes || loadingByComments || loadingArticles;

  return {
    byLikes,
    byComments,
    articles,
    error,
    loading,
  };
}
