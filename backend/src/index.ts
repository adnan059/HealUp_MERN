import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { AppError } from "./lib/types";

dotenv.config();

// env validation
const validateEnv = () => {
  const requiredVars = ["DB_URL", "FRONTEND_BASE_URL", "JWT_SK", "NODE_ENV"];
  const missingVars = requiredVars.filter((key) => !process.env[key]);
  if (missingVars.length > 0) {
    console.log("Missing environment variables:");
    missingVars.forEach((key) => console.log(` -${key}`));
    process.exit(1);
  }
};

validateEnv();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
const DB_URL = process.env.DB_URL as string;
const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL as string;

// app setup
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_BASE_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("working ok");
});

app.use("/api", routes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// error handling middleware
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const status = err?.status || 500;
  const message = err?.message || "Something went wrong";

  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// server start
const startServer = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
