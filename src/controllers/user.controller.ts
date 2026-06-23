import { Request, Response, NextFunction } from "express";
import {
  RegisterDto,
  LoginDto,
  UpdateProfileDto,
  UpdatePasswordFields,
} from "../dtos/user.dto";
import {
  registerUser,
  loginUser,
  getWhoami,
  updateUserProfile,
  updateUserPassword,
} from "../services/user.service";
import { successResponse, errorResponse } from "../utils/apihelper.util";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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
    const parsed = LoginDto.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      res.status(400).json(errorResponse("Validation failed", 400, errors));
      return;
    }

    const result = await loginUser(parsed.data);
    res.status(200).json(successResponse("Login successful", result, 200));
  } catch (error) {
    next(error);
  }
};

export const whoami = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json(errorResponse("Unauthorized", 401));
      return;
    }

    const result = await getWhoami(req.user.sub);
    res.status(200).json(successResponse("User fetched successfully", result, 200));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.sub) {
      res.status(401).json(errorResponse("Unauthorized", 401));
      return;
    }

    const isPasswordUpdate =
      req.body.currentPassword ||
      req.body.newPassword ||
      req.body.confirmPassword;

    if (isPasswordUpdate) {
      const parsed = UpdatePasswordFields.safeParse(req.body);
      if (!parsed.success) {
        const errors = parsed.error.flatten().fieldErrors;
        res.status(400).json(errorResponse("Validation failed", 400, errors));
        return;
      }

      const result = await updateUserPassword(req.user.sub, parsed.data);
      res.status(200).json(
        successResponse("Password updated successfully", result, 200)
      );
      return;
    }

    const parsed = UpdateProfileDto.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      res.status(400).json(errorResponse("Validation failed", 400, errors));
      return;
    }

    const protocol = req.protocol;
    const host = req.get("host");
    const baseUrl = `${protocol}://${host}`;

    const result = await updateUserProfile(
      req.user.sub,
      parsed.data,
      req.file?.filename,
      baseUrl
    );

    res.status(200).json(
      successResponse("Profile updated successfully", result, 200)
    );
  } catch (error) {
    next(error);
  }
};
