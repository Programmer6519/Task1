import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodo,
  updateTodo,
} from "../controllers/todo_controllers.js";

const todoRouter = Router();

todoRouter.route("/create").post(createTodo);
todoRouter.route("/get").get(getTodo);
todoRouter.route("/update").put(updateTodo);
todoRouter.route("/delete").delete(deleteTodo);

export { todoRouter };
