import * as CartItem from "../Models/CartItem.js";

export const getCart = async (req, res, next) => {
  try {
    const cart = await CartItem.getCart();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const added = await CartItem.addToCart({ productId, qty });
    res.status(201).json(added);
  } catch (err) {
    next(err);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { qty } = req.body;
    await CartItem.updateCartItemQty(id, qty);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const deleteCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { changes } = await CartItem.deleteCartItem(id);
    if (changes === 0) return res.status(404).json({ error: "Item not found" });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
