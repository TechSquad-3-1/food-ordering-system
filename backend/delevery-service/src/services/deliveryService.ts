import { IDelivery } from "../models/delivery";
import Delivery from "../models/delivery";

export class DeliveryService {
  // Create a new delivery
  static async createDelivery(deliveryData: IDelivery): Promise<IDelivery> {
    const delivery = new Delivery(deliveryData);
    return await delivery.save();
  }

  // Get all deliveries
  static async getAllDeliveries(): Promise<IDelivery[]> {
    return await Delivery.find();
  }

  // Get delivery by ID
  static async getDeliveryById(id: string): Promise<IDelivery | null> {
    return await Delivery.findById(id);
  }

  // Update delivery status
  static async updateDeliveryStatus(
    id: string,
    status: string
  ): Promise<IDelivery | null> {
    return await Delivery.findByIdAndUpdate(
      id,
      { deliveryStatus: status },
      { new: true }
    );
  }

  // Delete a delivery
  static async deleteDelivery(id: string): Promise<IDelivery | null> {
    return await Delivery.findByIdAndDelete(id);
  }
}
