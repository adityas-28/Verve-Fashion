import { all, get } from "../Config/db.js";

async function getAllProducts() {
  return await all("SELECT id, name, price FROM products ORDER BY name");
}

async function getProductById(id) {
  return await get("SELECT id, name, price FROM products WHERE id = ?", [id]);
}

export { getAllProducts, getProductById };
