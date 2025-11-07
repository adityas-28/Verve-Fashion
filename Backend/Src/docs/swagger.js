import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Verve Fashion API",
    version: "1.0.0",
    description:
      "REST API documentation for the Verve fashion e-commerce backend.",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Products", description: "Product catalogue operations" },
    { name: "Cart", description: "Shopping cart management" },
    { name: "Checkout", description: "Order checkout flow" },
  ],
  components: {
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          price: { type: "number", format: "float" },
          image: { type: "string", nullable: true },
        },
        required: ["id", "name", "price"],
      },
      CartItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          productId: { type: "string" },
          name: { type: "string" },
          price: { type: "number", format: "float" },
          qty: { type: "integer" },
          image: { type: "string", nullable: true },
        },
      },
      Receipt: {
        type: "object",
        properties: {
          id: { type: "string" },
          total: { type: "number", format: "float" },
          timestamp: { type: "string", format: "date-time" },
          buyer: {
            type: "object",
            properties: {
              name: { type: "string", nullable: true },
              email: { type: "string", nullable: true },
            },
          },
          cartItems: {
            type: "array",
            items: { $ref: "#/components/schemas/CartItem" },
          },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Utility"],
        summary: "Health check",
        responses: {
          200: {
            description: "API is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "List all products",
        responses: {
          200: {
            description: "Array of products",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/cart": {
      get: {
        tags: ["Cart"],
        summary: "Retrieve the current cart",
        responses: {
          200: {
            description: "Current cart state",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/CartItem" },
                    },
                    total: { type: "number", format: "float" },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Cart"],
        summary: "Add an item to the cart",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "qty"],
                properties: {
                  productId: { type: "string" },
                  qty: { type: "integer", minimum: 1 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Item added",
          },
        },
      },
    },
    "/api/cart/{id}": {
      put: {
        tags: ["Cart"],
        summary: "Update cart item quantity",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["qty"],
                properties: {
                  qty: { type: "integer", minimum: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Quantity updated" },
        },
      },
      delete: {
        tags: ["Cart"],
        summary: "Remove an item from the cart",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Item removed" },
          404: { description: "Item not found" },
        },
      },
    },
    "/api/checkout": {
      post: {
        tags: ["Checkout"],
        summary: "Complete checkout",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Checkout successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    receipt: { $ref: "#/components/schemas/Receipt" },
                  },
                },
              },
            },
          },
          400: { description: "Cart is empty" },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
