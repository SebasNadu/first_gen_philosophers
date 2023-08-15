import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/",
});

const authLink = setContext((_, { headers }) => {
  // const token = localStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGQ1MWQwMzhjNjA1NDllNDcxNzU5NTgiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2OTIwNzc1MDUsImV4cCI6MTY5MjA5NTUwNX0.eIGdH69cSH8Kh7TCgFXvzzOpBwGyWTwFByQyigOQ1Yw";
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const Client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default Client;
