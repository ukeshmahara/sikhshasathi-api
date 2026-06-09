import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/constant";
import { IUserPayload } from "../types/user.type";
import { errorResponse } from "../utils/apihelper.util";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}

export const authorizedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json(errorResponse("Access token is missing", 401));
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as IUserPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json(errorResponse("Invalid or expired token", 401));
  }
};