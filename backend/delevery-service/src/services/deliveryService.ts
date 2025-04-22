import { IDelivery } from "../models/delivery";
import Delivery from "../models/delivery";

export class DeliveryService {
  // Create a new delivery
  static async createDelivery(deliveryData: IDelivery): Promise<IDelivery> {
    const delivery = new Delivery(deliveryData);
    return await delivery.save();
  }

  // Get all deliveries (including those assigned to someone)
  static async getAllDeliveries(): Promise<IDelivery[]> {
    return await Delivery.find();
  }

  // Get deliveries that are not assigned to anyone (for picking up)
  static async getUnassignedDeliveries(): Promise<IDelivery[]> {
    return await Delivery.find({ assignedTo: null });
  }

  // get delivery count by delivery man
static async getDeliveryCountByDeliveryMan(deliveryManId: string): Promise<number> {
  return Delivery.countDocuments({ assignedTo: deliveryManId, deliveryStatus: "delivered" });
}

  // Get delivery by ID
  static async getDeliveryById(id: string): Promise<IDelivery | null> {
    return await Delivery.findById(id);
  }

  // Update delivery status and assign to delivery man
  static async assignDeliveryToMan(
    id: string,
    deliveryManId: string
  ): Promise<IDelivery | null> {
    const delivery = await Delivery.findById(id);
    if (delivery && delivery.assignedTo === null) {
      delivery.assignedTo = deliveryManId;
      delivery.deliveryStatus = "assigned";
      return await delivery.save();
    }
    return null;
  }

  // Update delivery status (to "delivered" or others)
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
