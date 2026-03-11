import { Router } from "express";
import {
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/user_controllers.js";
import { verifyJWT } from "../middlewares/auth_middleware.js";

const router = Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

// router.post("/logout", verifyJWT, logoutUser);

export default router;
