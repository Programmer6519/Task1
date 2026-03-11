import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodo,
  updateTodo,
} from "../controllers/todo_controllers.js";

const router = Router();

router.route("/createtodo").post(createTodo);
router.route("/readtodo").get(getTodo);
router.route("/updatetodo").put(updateTodo);
router.route("/deletetodo").delete(deleteTodo);

export default router;
