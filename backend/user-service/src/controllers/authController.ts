import { Request, Response } from "express";
import User, { UserRole } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middleware/authMiddleware";  // Ensure this is correct
import mongoose from "mongoose";

const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
};

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role, phone, address, restaurantName, vehicleNumber } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role,
    phone,
    address,
    restaurantName,
    vehicleNumber,
  });

  try {
    console.log("Registering user with data:", req.body); // Log the request data
    await user.save();
    res.status(201).json({ msg: "User registered" });
  } catch (error: unknown) {
    console.error("Registration error:", error); // Log error
    if (error instanceof Error) {
      res.status(500).json({ msg: "Error registering user", error: error.message });
    } else {
      res.status(500).json({ msg: "Unknown error occurred" });
    }
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ msg: "Invalid credentials" });
    return; // Ensure to exit early after sending the response
  }

  const token = generateToken(user.id, user.role);
  res.json({ token });
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
    const { name, email, phone, address, restaurantName, vehicleNumber } = req.body;
    const userId = req.params.userId; // Get userId from the route parameter
    const currentUser = req.user; // This comes from the middleware (protect)

    if (!currentUser) {
      res.status(401).json({ msg: "Unauthorized: No user found" });
      return;
    }

    // Admin can update any profile
    // Non-admins (users and delivery men) can only update their own profile (userId should match the logged-in user)
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== userId) {
      res.status(403).json({ msg: "Forbidden: You can only update your own profile" });
      return; 
    }

    try {
      // Check if the userId is valid
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ msg: "Invalid userId format" });
        return; 
      }

      // Find the user by ObjectId
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ msg: "User not found" });
        return;
      }

      // Only update the fields that are provided in the request body
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      user.restaurantName = restaurantName || user.restaurantName;
      user.vehicleNumber = vehicleNumber || user.vehicleNumber;

      await user.save();  // Save the updated user information

      res.status(200).json({ msg: "User updated successfully", user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ msg: "Error updating user", error: error.message });
      } else {
        res.status(500).json({ msg: "Unknown error occurred" });
      }
    }
};

  



// Delete user - Admin can delete any user, others can delete themselves
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
    const { userId } = req.params;
    const currentUser = req.user;
  
    // Check if currentUser is defined and if they have the correct permissions to delete
    if (!currentUser) {
        res.status(401).json({ msg: "Unauthorized: No user found" });
        return ;
    }
  
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== userId) {
      res.status(403).json({ msg: "Forbidden: You can only delete your own profile" });
        return ;
    }
  
    try {
      // Find the user by ID to delete
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ msg: "User not found" });
        return ;
      }
  
      // Delete the user using deleteOne()
      await user.deleteOne(); // Use `deleteOne()` instead of `remove()` in Mongoose v6
  
      // Send response confirming deletion
      res.status(200).json({ msg: "User deleted successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ msg: "Error deleting user", error: error.message });
      } else {
        res.status(500).json({ msg: "Unknown error occurred" });
      }
    }
  };
  
  
