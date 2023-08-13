import express from "express";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import context from "./utils/context.js";
import path from "path";
// import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function startApolloServer(typeDefs, resolvers) {
  try {
    const app = express();
    // const corsOptions = {
    //   origin: "*",
    //   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    //   exposedHeaders: [
    //     "Authorization",
    //     "Content-Type",
    //     "Apollo-Require-Preflight",
    //   ],
    // };
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      // cors: corsOptions,
      // uploads: false,
      // csrfPrevention: false,
    });

    // app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
    app.use("/images", express.static(path.join(__dirname, "images")));

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
