import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import productRoutes from "./Routes/productRoutes.js";
import cartRoutes from "./Routes/cartRoutes.js";
import checkoutRoutes from "./Routes/checkoutRoutes.js";
import errorHandler from "./Middlewares/errorHandler.js";
import swaggerSpec from "./docs/swagger.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to E-commerce API" });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use(errorHandler);

export default app;
