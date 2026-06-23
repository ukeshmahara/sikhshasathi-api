import { Router } from "express";
import {
  register,
  login,
  whoami,
  updateProfile,
} from "../controllers/user.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { profilePictureUpload } from "../middlewares/upload.middleware";

const userRouter = Router();

// POST /api/v1/auth/register
userRouter.post("/register", register);

// POST /api/v1/auth/login
userRouter.post("/login", login);

// GET /api/v1/auth/whoami (protected)
userRouter.get("/whoami", authorizedMiddleware, whoami);

// PUT /api/v1/auth/update (protected) – profile, password, or image upload
userRouter.put(
  "/update",
  authorizedMiddleware,
  profilePictureUpload.single("profilePicture"),
  updateProfile
);

export default userRouter;
