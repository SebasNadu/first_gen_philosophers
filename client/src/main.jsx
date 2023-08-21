import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { ApolloProvider } from "@apollo/client";
import Client from "./utils/apollo-client";
import { Provider } from "react-redux";
import store from "./store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={Client}>
    <NextUIProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </NextUIProvider>
  </ApolloProvider>
);
