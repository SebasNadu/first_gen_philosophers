import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import http from "http";

export async function startApolloServer(typeDefs, resolvers) {
  try {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    await server.start();

    app.use("/graphql", cors(), express.json(), expressMiddleware(server));

    app.use((error, req, res, next) => {
      console.log(error);
      const status = error.statusCode || 500;
      const message = error.message;
      const data = error.data;
      res.status(status).json({ message: message, data: data });
    });

    const desiredPort = process.env.PORT ?? 4000;
    await new Promise((resolve) =>
      httpServer.listen({ port: desiredPort }, resolve)
    );
    console.log(`🚀 Server ready at http://localhost:${desiredPort}/graphql`);
  } catch (error) {
    console.log("Error starting server", error.message);
    process.exit(1);
  }
}
