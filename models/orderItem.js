const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class OrderItem {
  // Create a new order item
  static async createItem(data) {
    return await prisma.orderItem.create({ data });
  }

  //Get all order items (needed for GET /order-items)
  static async listOrderItems() {
    return await prisma.orderItem.findMany({
      include: {
        product: true,
        order: true,
      },
    });
  }

  // Get all order items for a given order
  static async getItemsByOrderId(orderId) {
    return await prisma.orderItem.findMany({
      where: { orderId: Number(orderId) },
      include: { product: true },
    });
  }
}

module.exports = OrderItem;
