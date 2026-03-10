import { errorHandler } from "./middlewares/errorHandler.js";
import userRouter from "./routes/user_routes.js";
import todoRouter from "./routes/todo_routes.js";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("/public/temp"));
app.use(cors());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/todo", todoRouter);

app.use(errorHandler);

export default app;
