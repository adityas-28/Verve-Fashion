import express from "express";
import { getProducts } from "../Controllers/productController.js";
import asyncHandler from "../Middlewares/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getProducts));

export default router;
