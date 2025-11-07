import * as CartItem from "../Models/CartItem.js";
import { all, run } from "../Config/db.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Compute total securely using product prices from DB
 */
async function computeTotalFromCartItems(cartItems) {
  if (!cartItems || cartItems.length === 0) return 0;

  // Build list of productIds, query them in one go
  const ids = cartItems.map((ci) => `'${ci.productId}'`).join(",");
  const rows = await all(`SELECT id, price FROM products WHERE id IN (${ids})`);
  const priceMap = {};
  rows.forEach((r) => (priceMap[r.id] = r.price));
  let total = 0;
  cartItems.forEach((ci) => {
    const price = priceMap[ci.productId] || 0;
    total += price * ci.qty;
  });
  return total;
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

    // Prepare cart items for receipt (only productId and qty)
    const cartItems = cart.items.map((item) => ({
      productId: item.productId,
      qty: item.qty,
    }));

    // Compute total securely using product prices from DB
    const total = await computeTotalFromCartItems(cartItems);

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
