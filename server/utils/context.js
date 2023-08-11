import jwt from "jsonwebtoken";

const context = async ({ req }) => {
  const auth = req.headers.authorization || "";
  const token = auth.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return null;
    }
    return decoded;
  });
  return { user };
};

export default context;
