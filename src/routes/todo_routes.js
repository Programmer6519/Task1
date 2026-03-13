import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodo,
  updateTodo,
} from "../controllers/todo_controllers.js";

const todoRouter = Router();
todoRouter.post("/create", createTodo);
todoRouter.get("/get", getTodo);
todoRouter.put("/update", updateTodo);
todoRouter.delete("/delete", deleteTodo);

export { todoRouter };
