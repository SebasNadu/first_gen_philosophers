import { startApolloServer } from "./app.js";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import { connectDB } from "./config/db.js";

import dotenv from "dotenv";

dotenv.config();

startApolloServer(typeDefs, resolvers);
connectDB();
