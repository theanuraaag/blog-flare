import { handleError } from "../helpers/handleError.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return next(handleError(401, "Access denied. No token."));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(handleError(403, "Invalid or expired token."));
    req.userId = decoded.id;
    next();
  });
};
