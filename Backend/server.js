import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { init } from "./Src/Config/db.js";

import productRoutes from "./Src/Routes/productRoutes.js";
import cartRoutes from "./Src/Routes/cartRoutes.js";
import checkoutRoutes from "./Src/Routes/checkoutRoutes.js";
import errorHandler from "./Src/Middlewares/errorHandler.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

init()
  .then(() => {
    app.get("/", (req, res) => {
      res.json({ message: "Welcome to E-commerce API" });
    });

    app.use("/api/products", productRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/checkout", checkoutRoutes);

    app.get("/api/health", (req, res) => res.json({ ok: true }));

    app.use(errorHandler);

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("DB init failed", err);
    process.exit(1);
  });
