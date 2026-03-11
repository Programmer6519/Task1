import { Router } from "express";
import {
  createSubTodo,
  deleteSubTodo,
  getSubTodo,
  updateSubTodo,
} from "../controllers/subtodo_controllers.js";

import { verifyJWT } from "../middlewares/auth_middleware.js";

const subtodoRouter = Router();

subtodoRouter.route("/create").post(verifyJWT, createSubTodo);
subtodoRouter.route("/get").get(verifyJWT, getSubTodo);
subtodoRouter.route("/update").put(verifyJWT, updateSubTodo);
subtodoRouter.route("/delete").delete(verifyJWT, deleteSubTodo);

export { subtodoRouter };
