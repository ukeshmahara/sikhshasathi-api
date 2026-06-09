import { Router } from "express";
import { register, login } from "../controllers/user.controller";

const userRouter = Router();

// POST /api/auth/register
userRouter.post("/register", register);

// POST /api/auth/login
userRouter.post("/login", login);

export default userRouter;