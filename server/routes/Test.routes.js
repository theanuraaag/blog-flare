import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

const TestRoute = express.Router();

TestRoute.get("/protected", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "Access granted to protected route!",
    userId: req.userId,
  });
});

export default TestRoute;
