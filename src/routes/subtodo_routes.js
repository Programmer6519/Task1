import { Router } from "express";
import {
  createSubTodo,
  deleteSubTodo,
  getSubTodo,
  updateSubTodo,
} from "../controllers/subtodo_controllers.js";

import { verifyJWT } from "../middlewares/auth_middleware.js";
import { isOwner } from "../middlewares/isOwner_middleware.js";

const subtodoRouter = Router();

subtodoRouter.delete("/delete", isOwner, deleteSubTodo);
subtodoRouter.post("/create", isOwner, createSubTodo);
subtodoRouter.put("/update", isOwner, updateSubTodo);
subtodoRouter.get("/get", isOwner, getSubTodo);

export { subtodoRouter };
