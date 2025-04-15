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
