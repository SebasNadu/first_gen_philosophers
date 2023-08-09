import { startApolloServer } from "./app.js";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import { connectDB } from "./utils/db.js";

import dotenv from "dotenv";

dotenv.config();

connectDB();
startApolloServer(typeDefs, resolvers);
