import jwt from "jsonwebtoken";

const getUser = async (token) => {
  try {
    if (token) {
      const user = await jwt.verify(token, process.env.JWT_SECRET);
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const context = async ({ req }) => {
  // allow createUser and Login without token
  if (
    req.body.operationName === "CreateUser" ||
    req.body.operationName === "Login"
  ) {
    return {};
  }
  // get token from headers
  const token = req.headers.authorization || "";
  const user = await getUser(token);
  if (!user) {
    const error = new Error("Not authenticated");
    error.code = 401;
    throw error;
  }
  return { user };
};

export default context;
