import { Router, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware"; // Import AuthRequest
import { UserRole } from "../models/User"; // Ensure UserRole is correctly imported
import { register, login, updateUser, deleteUser, getAllUsers, getUserById, getRestaurantOwnerByIdPublic, deleteUserWithoutProtection, updateUserWithoutProtection } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Register route
router.post("/register", async (req: AuthRequest, res: Response) => {
  await register(req, res); // Call the register function directly
});

// Login route
router.post("/login", async (req: AuthRequest, res: Response) => {
  await login(req, res); // Call the login function directly
});

// Update user route
router.put(
  "/update/:userId",
  protect([UserRole.ADMIN, UserRole.RESTAURANT_OWNER, UserRole.USER, UserRole.DELIVERY_MAN]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await updateUser(req, res); // Call the updateUser function directly
    } catch (error) {
      res.status(500).json({ message: "Error during update" });
    }
  }
);

// Delete user route
router.delete(
  "/delete/:userId",
  protect([UserRole.ADMIN, UserRole.RESTAURANT_OWNER, UserRole.USER, UserRole.DELIVERY_MAN]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await deleteUser(req, res); // Call the deleteUser function directly
    } catch (error) {
      res.status(500).json({ message: "Error during delete" });
    }
  }
);

// Get all users - No role protection now
router.get("/users", async (req: AuthRequest, res: Response) => {
  await getAllUsers(req, res); // Get all users without role protection
});

// Get user by ID - No role protection now
router.get("/user/:userId", async (req: AuthRequest, res: Response) => {
  await getUserById(req, res); // Get user by ID without role protection
});

router.get("/restaurant-owner/:userId", getRestaurantOwnerByIdPublic);


// Update user without protection (Anyone can update any user)
router.put("/update-user/:userId", async (req: AuthRequest, res: Response) => {
  await updateUserWithoutProtection(req, res); // Call the update function directly
});

// Delete user without protection (Anyone can delete themselves)
router.delete("/delete-user/:userId", async (req: AuthRequest, res: Response) => {
  await deleteUserWithoutProtection(req, res); // Call the delete function directly
});


export default router;