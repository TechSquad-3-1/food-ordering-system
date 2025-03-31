import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import deliveryRoutes from "./routes/deliveryRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/delivery", deliveryRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Delivery Panel API is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
