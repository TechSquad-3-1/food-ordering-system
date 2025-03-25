import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    await user.save();
    res.status(201).json({ msg: "User registered" });
  } catch (error: unknown) {
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
      res.status(401).json({ msg: "Invalid credentials" }); // Send response without returning it
      return; // Ensure to exit early after sending the response
    }
  
    const token = generateToken(user.id, user.role);
    res.json({ token }); // Send the response
  };
  
