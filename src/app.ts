import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { HttpException } from "./exceptions/http-exception";
import { errorResponse } from "./utils/apihelper.util";
import userRouter from "./routes/user.route";

const app: Application = express();

// ── Middleware ──
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ── Static uploads ──
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ── Health check ──
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "SikhshaSathi API is running 🎓", status: "OK" });
});

// ── Routes ──
app.use("/api/v1/auth", userRouter);

// ── 404 handler ──
app.use((_req: Request, res: Response) => {
  res.status(404).json(errorResponse("Route not found", 404));
});

// ── Global error handler ──
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpException) {
    return res.status(err.status).json(errorResponse(err.message, err.status));
  }
  if (err.message === "Only JPEG, PNG, and WebP images are allowed") {
    return res.status(400).json(errorResponse(err.message, 400));
  }
  if (err.message?.includes("File too large")) {
    return res.status(400).json(errorResponse("File size must be under 5MB", 400));
  }
  console.error("Unhandled error:", err);
  res.status(500).json(errorResponse("Internal server error", 500));
});

export default app;