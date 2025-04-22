import express from "express";
import { DeliveryController } from "../controllers/deliveryController";

const router = express.Router();

// Create a new delivery
router.post("/", DeliveryController.createDelivery);

// Get all deliveries (assigned + unassigned)
router.get("/", DeliveryController.getAllDeliveries);

// Get all unassigned deliveries (for delivery men to pick)
router.get("/unassigned", DeliveryController.getUnassignedDeliveries);

// Get delivery by ID
router.get("/:id", DeliveryController.getDeliveryById);

// Assign delivery to a delivery man
router.put("/:id/assign", DeliveryController.assignDeliveryToMan);

// Update delivery status
router.put("/:id/status", DeliveryController.updateDeliveryStatus);

// Delete delivery
router.delete("/:id", DeliveryController.deleteDelivery);

router.get("/count/:deliveryManId", DeliveryController.getDeliveryCount);

export default router;
