import express from "express";
import { DeliveryController } from "../controllers/deliveryController";

const router = express.Router();

// Create a new delivery
router.post("/", DeliveryController.createDelivery);

// Get all deliveries
router.get("/", DeliveryController.getAllDeliveries);

// Get delivery by ID
router.get("/:id", DeliveryController.getDeliveryById);

// Update delivery status
router.put("/:id/status", DeliveryController.updateDeliveryStatus);

// Delete delivery
router.delete("/:id", DeliveryController.deleteDelivery);

export default router;
