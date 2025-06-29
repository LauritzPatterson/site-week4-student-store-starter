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

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    // ✅ Normalize field name so frontend always receives `image_url`
    return products.map((p) => ({
      ...p,
      image_url: p.image_url || p.imageUrl,
    }));
  }

  static async getProductById(id) {
    return await prisma.product.findUnique({
      where: { id: Number(id) },
    });
  }

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

  static async updateProduct(id, data) {
    return await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        image_url: data.image_url,
        category: data.category,
      },
    });
  }

  static async deleteProduct(id) {
    return await prisma.product.delete({
      where: { id: Number(id) },
    });
  }
}

module.exports = Product;
