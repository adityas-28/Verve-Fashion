import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
} from "../Controllers/cartController.js";
import asyncHandler from "../Middlewares/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getCart));
router.post("/", asyncHandler(addToCart));
router.put("/:id", asyncHandler(updateCartItem)); // update qty
router.delete("/:id", asyncHandler(deleteCartItem));

export default router;
