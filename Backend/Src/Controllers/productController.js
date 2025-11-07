import * as Product from "../Models/product.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.getAllProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
};
