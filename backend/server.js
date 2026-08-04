import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import passport from "passport";
import "./config/passport.js";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://task-manager-mu-jet-14.vercel.app",
  "https://task-manager-rho-one-47.vercel.app",
  "https://task-manager-git-main-vivek-rawat33s-projects.vercel.app",
];

const vercelPreviewPattern = /^https:\/\/task-manager-[a-z0-9-]+\.vercel\.app$/;

const corsOptions = {
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      vercelPreviewPattern.test(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

app.use(express.json());
app.use(passport.initialize());

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Task Tracker API is running" });
});

if (process.env.NODE_ENV !== 'production') {
  app.get("/api/debug", (req, res) => {
    res.json({
      message: "Latest backend code is running",
      time: new Date().toISOString(),
    });
  });
  app.get("/api/tasks/direct-test", (req, res) => {
    res.json({ message: "Direct tasks route working" });
  });
}

app.use("/api/teams", teamRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
