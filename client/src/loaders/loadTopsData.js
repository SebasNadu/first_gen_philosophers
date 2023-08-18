import { useQuery } from "@apollo/client";
import { GET_TOPS_BY_LIKES, GET_TOPS_BY_COMMENTS } from "../graphql/queries";

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

  const byLikes = dataByLikes ? dataByLikes.getTopArticlesByLikes : null;
  const byComments = dataByComments
    ? dataByComments.getTopArticlesByComments
    : null;
  const error = errorByLikes || errorByComments;
  const loading = loadingByLikes || loadingByComments;

  return {
    byLikes,
    byComments,
    error,
    loading,
  };
}
