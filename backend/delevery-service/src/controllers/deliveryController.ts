import { Request, Response } from "express";
import { DeliveryService } from "../services/deliveryService";

export class DeliveryController {
  // Create a new delivery
  static async createDelivery(req: Request, res: Response): Promise<void> {
    try {
      const delivery = await DeliveryService.createDelivery(req.body);
      res.status(201).json(delivery);
    } catch (error) {
      res.status(400).json({ message: "Failed to create delivery", error });
    }
  }

  // Get all deliveries (both assigned and unassigned)
  static async getAllDeliveries(req: Request, res: Response): Promise<void> {
    try {
      const deliveries = await DeliveryService.getAllDeliveries();
      res.status(200).json(deliveries);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch deliveries", error });
    }
  }

  // Get all unassigned deliveries (for the delivery man to pick)
  static async getUnassignedDeliveries(req: Request, res: Response): Promise<void> {
    try {
      const deliveries = await DeliveryService.getUnassignedDeliveries();
      res.status(200).json(deliveries);
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch unassigned deliveries", error });
    }
  }

  // Get delivery by ID
  static async getDeliveryById(req: Request, res: Response): Promise<void> {
    try {
      const delivery = await DeliveryService.getDeliveryById(req.params.id);
      if (delivery) {
        res.status(200).json(delivery);
      } else {
        res.status(404).json({ message: "Delivery not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Failed to fetch delivery", error });
    }
  }

  // Assign a delivery to a delivery man
  static async assignDeliveryToMan(req: Request, res: Response): Promise<void> {
    const { deliveryManId } = req.body;
    try {
      const updatedDelivery = await DeliveryService.assignDeliveryToMan(
        req.params.id,
        deliveryManId
      );
      if (updatedDelivery) {
        res.status(200).json(updatedDelivery);
      } else {
        res.status(404).json({ message: "Delivery not found or already assigned" });
      }
    } catch (error) {
      res.status(400).json({ message: "Failed to assign delivery", error });
    }
  }

  // Update delivery status (e.g., delivered)
  static async updateDeliveryStatus(req: Request, res: Response): Promise<void> {
    try {
      const updatedDelivery = await DeliveryService.updateDeliveryStatus(
        req.params.id,
        req.body.status
      );
      if (updatedDelivery) {
        res.status(200).json(updatedDelivery);
      } else {
        res.status(404).json({ message: "Delivery not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Failed to update delivery status", error });
    }
  }

  // Delete delivery
  static async deleteDelivery(req: Request, res: Response): Promise<void> {
    try {
      const deletedDelivery = await DeliveryService.deleteDelivery(req.params.id);
      if (deletedDelivery) {
        res.status(200).json({ message: "Delivery deleted" });
      } else {
        res.status(404).json({ message: "Delivery not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Failed to delete delivery", error });
    }
  }
}
