import { startApolloServer } from "./app.js";
import typeDefs from "./modules/schemas_index.js";
import resolvers from "./modules/resolvers_index.js";
import { connectDB } from "./utils/db.js";

import dotenv from "dotenv";

dotenv.config();

connectDB();
startApolloServer(typeDefs, resolvers);
