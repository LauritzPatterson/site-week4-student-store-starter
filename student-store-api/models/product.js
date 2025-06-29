const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Product {
  static async listProducts(filters = {}) {
    const { category, sort } = filters;

    const where = category
      ? { category: { equals: category, mode: "insensitive" } }
      : {};

    let orderBy = undefined;
    if (sort === "price" || sort === "name") {
      orderBy = { [sort]: "asc" };
    }

    return await prisma.product.findMany({
      where,
      orderBy,
    });
  }

  static async getProductById(id) {
    return await prisma.product.findUnique({
      where: { id: Number(id) },
    });
  }

  // ✅ This is the missing method
  static async createProduct(data) {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image_url: data.image_url,
        category: data.category,
      },
    });
  }
}

module.exports = Product;
