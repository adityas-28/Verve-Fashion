import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ReceiptModal from "../ReceiptModal.jsx";

const BASE_RECEIPT = {
  id: "order-123",
  total: 2598,
  timestamp: "2024-05-01T10:00:00.000Z",
  buyer: { name: "Test User", email: "test@example.com" },
  cartItems: [
    { productId: "prod-1", name: "Test Tee", qty: 2 },
  ],
};

describe("ReceiptModal", () => {
  it("renders receipt details when provided", () => {
    render(
      <MemoryRouter>
        <ReceiptModal receipt={BASE_RECEIPT} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /order confirmed/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Test User/)).toBeInTheDocument();
    expect(screen.getByText(/₹2598\.00/)).toBeInTheDocument();
    expect(screen.getByText(/Test Tee × 2/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /continue shopping/i })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("returns null when no receipt is passed", () => {
    const { container } = render(
      <MemoryRouter>
        <ReceiptModal receipt={null} />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });
});

