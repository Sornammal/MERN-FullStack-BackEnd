import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import { notFound, errorHandler } from "./src/middleware/error.js";
import path from "path";
import fs from "fs";
// Import Routes
import routes from "./src/routes/index.js";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables
dotenv.config();
//if u wanna create JWT Screate code pls use this comment node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

//console.log(process.env.JWT_SECRET);
// Connect DB
connectDB();

const app = express();
// Middleware
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(
  cors()
);
// API Routes
app.use("/", routes)
app.use('/uploads', express.static('uploads'));

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
