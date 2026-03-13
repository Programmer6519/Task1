import { Router } from "express";
import {
  loginUser,
  logoutUser,
  sendOTP,
  signupUser,
  verifyOTP,
} from "../controllers/user_controllers.js";
import { verifyJWT } from "../middlewares/auth_middleware.js";

const userRouter = Router();

userRouter.post("/signup", signupUser);
userRouter.post("/verify", verifyOTP);
userRouter.post("/sendotp", sendOTP);
userRouter.post("/login", loginUser);
userRouter.post("/logout", verifyJWT, logoutUser);

export { userRouter };
