import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/",
});

const authLink = setContext((_, { headers }) => {
  // const token = localStorage.getItem("token");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGQ1MWQwMzhjNjA1NDllNDcxNzU5NTgiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2OTIwNDc5NjEsImV4cCI6MTY5MjA2NTk2MX0.ANL49KIPYbXD2qIMzBmLJIhOKxazIWMD6G-aIWHa6QY";
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
