import { errorHandler } from "./middlewares/errorHandler.js";
import { verifyJWT } from "./middlewares/auth_middleware.js";
import { subtodoRouter } from "./routes/subtodo_routes.js";
import { userRouter } from "./routes/user_routes.js";
import { todoRouter } from "./routes/todo_routes.js";
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("/public/temp"));
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/todo", verifyJWT, todoRouter);
app.use("/api/v1/subtodo", verifyJWT, subtodoRouter);

app.use(errorHandler);

export default app;
