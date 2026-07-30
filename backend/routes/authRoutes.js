import express from "express";
import {
  userSignup,
  userSignin,
  getMe,
  googleLogin,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import passport from "passport";
import "../config/passport.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/signup",
  }),
  googleLogin,
);

router.post("/signup", userSignup);
router.post("/signin", userSignin);
router.get("/me", protect, getMe);

export default router;
