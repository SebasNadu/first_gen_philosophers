import { userResolver } from "./users/resolvers.js";
import { articleResolver } from "./articles/resolvers.js";
import { commentResolver } from "./comments/resolvers.js";

export default [userResolver, articleResolver, commentResolver];
