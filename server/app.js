import express from "express";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
// import context from "./utils/context.js";
import jwt from "jsonwebtoken";

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
      context: async ({ req }) => {
        const auth = req.headers.authorization || "";
        const token = auth.split(" ")[1];
        const user = jwt.verify(
          token,
          process.env.JWT_SECRET,
          (err, decoded) => {
            if (err) {
              return null;
            }
            return decoded;
          }
        );
        return { user };
      },
    });
    console.log(`🚀 Server ready at ${url}`);
  } catch (error) {
    console.log("Error starting server", error.message);
    process.exit(1);
  }
}
