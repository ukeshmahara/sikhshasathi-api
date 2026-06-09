import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { HttpException } from "./exceptions/http-exception";
import { errorResponse } from "./utils/apihelper.util";
import userRouter from "./routes/user.route";

const app: Application = express();

// ── Middleware ──
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ── Health check ──
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "SikhshaSathi API is running 🎓", status: "OK" });
});

// ── Routes ──
app.use("/api/auth", userRouter);

// ── 404 handler ──
app.use((_req: Request, res: Response) => {
  res.status(404).json(errorResponse("Route not found", 404));
});

// ── Global error handler ──
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpException) {
    return res.status(err.status).json(errorResponse(err.message, err.status));
  }
  console.error("Unhandled error:", err);
  res.status(500).json(errorResponse("Internal server error", 500));
});

export default app;