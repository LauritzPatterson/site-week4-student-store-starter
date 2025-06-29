const express = require("express");
const cors = require("cors");
const Product = require("../models/product");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//  GET all products (with optional filters)
app.get("/products", async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      sort: req.query.sort,
    };

    const products = await Product.listProducts(filters);
    res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

//  GET product by ID
app.get("/products/:productId", async (req, res) => {
  try {
    const product = await Product.getProductById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST new product
app.post("/products", async (req, res) => {
  try {
    const { name, description, price, image_url, category } = req.body;

    if (!name || !description || !price || !image_url || !category) {
      return res.status(400).json({ error: "Missing required product fields" });
    }

    const newProduct = await Product.createProduct({
      name,
      description,
      price,
      image_url,
      category,
    });

    res.status(201).json({ product: newProduct });
  } catch (err) {
    console.error("Failed to create product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

//  Orders

app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.listOrders();
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.getOrderById(req.params.id);
    if (order) {
      res.json({ order });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

app.post("/orders", async (req, res) => {
  console.log("Incoming request body:", req.body);
  try {
    const { customer, dorm, status } = req.body;

    if (!customer || !dorm) {
      return res.status(400).json({ error: "Missing customer or dorm info" });
    }

    const newOrder = await Order.createOrder({
      customer,
      total: 0, // start with total 0 — can be updated later
      status: status || "pending",
    });

    res.status(201).json({ order: newOrder });
  } catch (err) {
    console.error("Failed to create order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.put("/orders/:id", async (req, res) => {
  try {
    const updated = await Order.updateOrder(req.params.id, req.body);
    res.json({ order: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order" });
  }
});

app.delete("/orders/:id", async (req, res) => {
  try {
    await Order.deleteOrder(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// Order Items

app.post("/order-items", async (req, res) => {
  try {
    const { orderId, productId, quantity, price } = req.body;

    if (!orderId || !productId || !quantity || !price) {
      return res
        .status(400)
        .json({ error: "Missing required order item fields" });
    }

    const newItem = await OrderItem.createItem({
      orderId,
      productId,
      quantity,
      price,
    });
    res.status(201).json({ orderItem: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order item" });
  }
});

app.get("/order-items", async (req, res) => {
  try {
    const items = await OrderItem.listOrderItems();
    res.json({ orderItems: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch order items" });
  }
});

//— MF ADD ITEMS TO ORDER
app.post("/orders/:orderId/items", async (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    const { productId, quantity, price } = req.body;

    if (!productId || !quantity || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newItem = await OrderItem.createItem({
      orderId,
      productId,
      quantity,
      price,
    });
    res.status(201).json({ orderItem: newItem });
  } catch (err) {
    console.error("Failed to add item to order:", err);
    res.status(500).json({ error: "Failed to add item to order" });
  }
});

// — CALCULATE ORDER TOTAL
app.get("/orders/:orderId/total", async (req, res) => {
  try {
    const total = await Order.calculateTotal(req.params.orderId);
    res.json({ total });
  } catch (err) {
    console.error("Failed to calculate total:", err);
    res.status(500).json({ error: "Failed to calculate order total" });
  }
});

// Test route
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
