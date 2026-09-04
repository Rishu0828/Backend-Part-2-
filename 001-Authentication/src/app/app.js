import express from "express";
import jwt from "jsonwebtoken";
import userModel from "./models/user.models.js";
import { authenticate } from "./middleware/auth.middleware.js";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Authentication API",
  });
});

app.post("/api/auth/register", async (req, res) => {
  let { name, email, password } = req.body;

  const user = await userModel.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.status(201).json({
    message: "User registered successfully",
    data: {
      user: {
        name,
        email,
        id: user._id,
      },
    },
    token,
  });
});

app.get("/api/auth/me", authenticate, async (req, res) => {
  console.log(req.user);
  res.status(200).json({
    message: "User fetched successfully",
    data: {
      user: req.user,
    },
  });
});


app.post("/api/auth/login", async (req, res) => {
  const {email, password} = req.body;

  const user = await userModel.findOne({email});


  const isvalidPassword = await bcrypt.compare(password, user.password);

  if(!isvalidPassword){
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.status(200).json({
    message: "User logged in successfully",
    data: {
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
    },
    token,
  });


})

export default app;
