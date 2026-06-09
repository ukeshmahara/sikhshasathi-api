import { Request, Response, NextFunction } from "express";
import { RegisterDto, LoginDto } from "../dtos/user.dto";
import { registerUser, loginUser } from "../services/user.service";
import { successResponse, errorResponse } from "../utils/apihelper.util";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body with Zod
    const parsed = RegisterDto.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      res.status(400).json(errorResponse("Validation failed", 400, errors));
      return;
    }

    const result = await registerUser(parsed.data);
    res.status(201).json(
      successResponse("User registered successfully", result, 201)
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body with Zod
    const parsed = LoginDto.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      res.status(400).json(errorResponse("Validation failed", 400, errors));
      return;
    }

    const result = await loginUser(parsed.data);
    res.status(200).json(
      successResponse("Login successful", result, 200)
    );
  } catch (error) {
    next(error);
  }
};