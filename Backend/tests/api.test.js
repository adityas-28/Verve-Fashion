import request from "supertest";

import app from "../Src/app.js";
import {
  init,
  reset,
  run,
  all,
  close,
} from "../Src/Config/db.js";

const PRODUCT_FIXTURE = {
  id: "prod-test-1",
  name: "Test Tee",
  price: 1299,
  image: "test-tee",
};

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await reset();
  await run(
    "INSERT INTO products (id, name, price, image) VALUES (?,?,?,?)",
    [
      PRODUCT_FIXTURE.id,
      PRODUCT_FIXTURE.name,
      PRODUCT_FIXTURE.price,
      PRODUCT_FIXTURE.image,
    ]
  );
});

afterAll(async () => {
  await reset();
  await close();
});

describe("API integration", () => {
  it("responds with health check", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("lists products", async () => {
    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      products: [
        {
          id: PRODUCT_FIXTURE.id,
          name: PRODUCT_FIXTURE.name,
          price: PRODUCT_FIXTURE.price,
          image: PRODUCT_FIXTURE.image,
        },
      ],
    });
  });

  it("supports full cart checkout flow", async () => {
    const addRes = await request(app)
      .post("/api/cart")
      .send({ productId: PRODUCT_FIXTURE.id, qty: 2 });

    expect(addRes.status).toBe(201);
    expect(addRes.body).toMatchObject({
      productId: PRODUCT_FIXTURE.id,
      qty: 2,
    });

    const cartRes = await request(app).get("/api/cart");
    expect(cartRes.status).toBe(200);
    expect(cartRes.body.total).toBe(PRODUCT_FIXTURE.price * 2);
    expect(cartRes.body.items[0]).toMatchObject({
      productId: PRODUCT_FIXTURE.id,
      qty: 2,
      name: PRODUCT_FIXTURE.name,
      price: PRODUCT_FIXTURE.price,
    });

    const checkoutRes = await request(app)
      .post("/api/checkout")
      .send({ name: "Ada Lovelace", email: "ada@example.com" });

    expect(checkoutRes.status).toBe(200);
    expect(checkoutRes.body.receipt.total).toBe(PRODUCT_FIXTURE.price * 2);
    expect(checkoutRes.body.receipt.cartItems[0]).toMatchObject({
      productId: PRODUCT_FIXTURE.id,
      qty: 2,
      name: PRODUCT_FIXTURE.name,
      image: PRODUCT_FIXTURE.image,
    });

    const storedReceipts = await all("SELECT id, total FROM receipts");
    expect(storedReceipts).toHaveLength(1);
    expect(storedReceipts[0].total).toBe(PRODUCT_FIXTURE.price * 2);

    const cartAfterCheckout = await request(app).get("/api/cart");
    expect(cartAfterCheckout.body.items).toHaveLength(0);
    expect(cartAfterCheckout.body.total).toBe(0);
  });
});

