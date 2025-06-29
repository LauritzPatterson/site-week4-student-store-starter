const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class Order {
  static async listOrders() {
    return await prisma.order.findMany({
      include: { items: true },
    })
  }

  static async getOrderById(id) {
    return await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { items: true }, // include order items
    })
  }

  static async createOrder({ customer, total, status }) {
    return await prisma.order.create({
      data: {
        customer,
        total,
        status,
      },
    })
  }

  static async updateOrder(id, data) {
    return await prisma.order.update({
      where: { id: Number(id) },
      data,
    })
  }

  static async deleteOrder(id) {
    return await prisma.order.delete({
      where: { id: Number(id) },
    })
  }

  // : Calculate total for a given order
  static async calculateTotal(orderId) {
    const items = await prisma.orderItem.findMany({
      where: { orderId: Number(orderId) },
    })

    const total = items.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)

    return total
  }
}

module.exports = Order