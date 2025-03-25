import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const protect = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
      if (!roles.includes(decoded.role))
        return res.status(403).json({ msg: "Forbidden" });

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ msg: "Token invalid" });
    }
  };
};
