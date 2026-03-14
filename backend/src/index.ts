import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { AppError } from "./lib/types";
import { startCleanupWorker } from "./workers/cleanupWorker";

dotenv.config();

// env validation
const validateEnv = () => {
  const requiredVars = [
    "PORT",
    "DB_URL",
    "JWT_SK",
    "NODE_ENV",
    "SP_ENDPOINT",
    "SP_USERNAME",
    "SP_PASSWORD",
    "SP_PREFIX",
    "PAYMENT_WINDOW_MINUTES",
    "FRONTEND_URL",
    "BACKEND_URL",
  ];
  const missingVars = requiredVars.filter((key) => !process.env[key]);
  if (missingVars.length > 0) {
    console.error("Missing environment variables:");
    missingVars.forEach((key) => console.error(` - ${key}`));

    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};

validateEnv();

const DB_URL = process.env.DB_URL as string;
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

// db setup
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return; // reuse existing connection

  try {
    await mongoose.connect(DB_URL);
    isConnected = true;
    console.log("Database connected successfully");
    startCleanupWorker();
  } catch (error) {
    console.error("DB connection failed:", error);
    throw error;
  }
};

// app setup
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

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

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        console.log("Database connected successfully");
        startCleanupWorker();
        console.log(`Server running at http://localhost:${PORT}`);
      })
      .catch((err) => {
        console.error("DB connection failed:", err);
        process.exit(1);
      });
  });
}

export default app;
