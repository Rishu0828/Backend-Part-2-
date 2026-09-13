import { Router } from "express";
import userModel from "../models/user.model.js";
import {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/auth.js";
import bcrypt from "bcryptjs";

const router = Router();

/**
 * @POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const isUserExists = await userModel.findOne({ email });

  if (isUserExists) {
    return res.status(400).json({
      message: "User already exist",
      errors: [
        {
          path: "email",
          message: "User already exists",
        },
      ],
    });
  }

  const user = await userModel.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
  });

  const { accessToken, refreshToken } = generateTokens({ userId: user._id });

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });

  res.status(201).json({
    message: "User register succesfully",
    data: {
      user: {
        name: user.name,
        email: user.email,
      },
    },
    token: accessToken,
  });
});

/**
 * @GET /api/auth/me
 */
router.get("/me", async (req, res) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  try {
    const decoded = verifyAccessToken(accessToken);

    const user = await userModel.findById(decoded.id);

    return res.status(200).json({
      message: "user featched sussecfully",
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorised user, Invalid or expired access token",
      error: error,
    });
  }
});

/**
 * @POST /api/auth/refresh
 */

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Unauthorised, refresh token not found",
    });
  }

  try {
    const decoed = await verifyRefreshToken(refreshToken);

    const user = await userModel.findById(decoed.id);

    if (refreshToken !== user.refreshToken) {
      user.refreshToken = null;
      await user.save();

      return res.status(401).json({
        message: "Unaourized, refresh token mismatch ",
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: user._id,
    });

    res.cookie("refreshToken", newRefreshToken, { httpOnly: true });

    user.refreshToken = newRefreshToken;

    await user.save();

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorize, invalid or expired refresh token",
      error: error,
    });
  }
});

export default router;
