import express from "express";
import { checkout } from "../Controllers/checkoutController.js";
import asyncHandler from "../Middlewares/asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(checkout));

export default router;
