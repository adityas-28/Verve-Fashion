import { all, get, run } from "../Config/db.js";
import { v4 as uuidv4 } from "uuid";

async function getCart() {
  const rows = await all(
    `SELECT c.id, c.productId, c.qty, p.name, p.price
     FROM cart c LEFT JOIN products p ON c.productId = p.id`
  );
  const items = rows.map((r) => ({
    id: r.id,
    productId: r.productId,
    qty: r.qty,
    name: r.name,
    price: r.price,
  }));
  const total = items.reduce((s, it) => s + (it.price || 0) * it.qty, 0);
  return { items, total };
}

async function addToCart({ productId, qty }) {
  if (!productId || !qty || qty <= 0) throw new Error("Invalid payload");
  const existing = await get("SELECT id, qty FROM cart WHERE productId = ?", [
    productId,
  ]);
  if (existing) {
    const newQty = existing.qty + qty;
    await run("UPDATE cart SET qty = ? WHERE id = ?", [newQty, existing.id]);
    return { id: existing.id, productId, qty: newQty };
  } else {
    const id = uuidv4();
    await run("INSERT INTO cart (id, productId, qty) VALUES (?,?,?)", [
      id,
      productId,
      qty,
    ]);
    return { id, productId, qty };
  }
}

async function updateCartItemQty(cartId, qty) {
  if (!cartId || qty <= 0) throw new Error("Invalid payload");
  const res = await run("UPDATE cart SET qty = ? WHERE id = ?", [qty, cartId]);
  return res;
}

async function deleteCartItem(cartId) {
  const res = await run("DELETE FROM cart WHERE id = ?", [cartId]);
  return res;
}

async function clearCart() {
  const res = await run("DELETE FROM cart");
  return res;
}

export { getCart, addToCart, updateCartItemQty, deleteCartItem, clearCart };
