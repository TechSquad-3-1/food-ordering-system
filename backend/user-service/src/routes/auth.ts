import { Router, Request, Response } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

// Register route
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    await register(req, res); // Calling the controller function
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ msg: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ msg: "Unknown error occurred" });
    }
  }
});

// Login route
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    await login(req, res); // Calling the controller function
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ msg: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ msg: "Unknown error occurred" });
    }
  }
});

export default router;
