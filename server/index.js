import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import AuthRoute from "./routes/Auth.route.js";
import TestRoute from "./routes/Test.routes.js";


dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use('/server/auth', AuthRoute)
app.use('/server/test', TestRoute)

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "blog-flare" })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database connection failed.", err));

app.listen(PORT, () => {
  console.log(`server is running at Port ${PORT}`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
