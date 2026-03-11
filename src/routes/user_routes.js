import { Router } from "express";
import {
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/user_controllers.js";
import { verifyJWT } from "../middlewares/auth_middleware.js";

const userRouter = Router();

userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.route("/logout").post(verifyJWT, logoutUser);

// router.post("/logout", verifyJWT, logoutUser);

export { userRouter };
