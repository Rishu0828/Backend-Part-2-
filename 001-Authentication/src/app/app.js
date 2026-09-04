import express from "express";
import jwt from "jsonwebtoken";
const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Authentication API",
  });
});

app.post("/api/auth/register", (req, res) => {
  let { name, email, password } = req.body;

  //  # Save Data to DataBase

  const token = jwt.sign(
    { name, email },
    "5015a34c3246b729772aa03841ee350223057ba7ad75dc2012b54ae91f6513ea",
  );

  res.status(201).json({
    message: "User registered successfully",
    data: {
      user: {
        name,
        email,
      },
    },
    token,
  });
});

export default app;
