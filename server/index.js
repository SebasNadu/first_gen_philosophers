import { startApolloServer } from "./app.js";
import typeDefs from "./modules/schemas_index.js";
import resolvers from "./modules/resolvers_index.js";
import { connectDB } from "./utils/db.js";

import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});

connectDB();
startApolloServer(typeDefs, resolvers);
