import * as CartItem from "../Models/CartItem.js";
import { all, run } from "../Config/db.js";
import { v4 as uuidv4 } from "uuid";

// Fetch product metadata (name, image, price) for a list of ids
async function getProductsByIds(productIds) {
  if (!productIds || productIds.length === 0) return {};
  const placeholders = productIds.map(() => "?").join(",");
  const rows = await all(
    `SELECT id, name, image, price FROM products WHERE id IN (${placeholders})`,
    productIds
  );
  const productMap = {};
  rows.forEach((r) => {
    productMap[r.id] = { name: r.name, image: r.image, price: r.price };
  });
  return productMap;
}

export const checkout = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // Get current cart
    const cart = await CartItem.getCart();

    // Check if cart is empty
    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Enrich with product metadata directly from products table
    const productIds = cart.items.map((ci) => ci.productId);
    const productMap = await getProductsByIds(productIds);

    // Prepare cart items for receipt with reliable name/image
    const cartItems = cart.items.map((item) => ({
      productId: item.productId,
      qty: item.qty,
      name: productMap[item.productId]?.name || item.name || null,
      image: productMap[item.productId]?.image || item.image || null,
    }));

    // Compute total securely using product prices from DB
    const total = cartItems.reduce((sum, ci) => {
      const price = productMap[ci.productId]?.price || 0;
      return sum + price * (ci.qty || 0);
    }, 0);

    // Create receipt
    const receipt = {
      id: uuidv4(),
      total,
      timestamp: new Date().toISOString(),
      buyer: { name: name || null, email: email || null },
      cartItems,
    };

    // Save receipt to database
    await run(
      "INSERT INTO receipts (id, total, timestamp, payload) VALUES (?,?,?,?)",
      [receipt.id, receipt.total, receipt.timestamp, JSON.stringify(receipt)]
    );

    // Clear the cart after successful checkout
    await CartItem.clearCart();

    res.json({ receipt });
  } catch (err) {
    next(err);
  }
};
