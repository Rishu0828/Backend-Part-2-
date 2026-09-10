import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "../routes/auth.route.js";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  return res.send("Hello, World!");
});

export default app;
