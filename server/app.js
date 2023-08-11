import express from "express";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import context from "./utils/context.js";

export async function startApolloServer(typeDefs, resolvers) {
  try {
    const app = express();
    const corsOptions = {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      exposedHeaders: ["Authorization"],
    };
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      cors: corsOptions,
    });

    app.use((error, req, res, next) => {
      console.log(error);
      const status = error.statusCode || 500;
      const message = error.message;
      const data = error.data;
      res.status(status).json({ message: message, data: data });
    });

    const desiredPort = process.env.PORT ?? 4000;
    const { url } = await startStandaloneServer(server, {
      listen: { port: desiredPort },
      context: context,
    });
    console.log(`🚀 Server ready at ${url}`);
  } catch (error) {
    console.log("Error starting server", error.message);
    process.exit(1);
  }
}
