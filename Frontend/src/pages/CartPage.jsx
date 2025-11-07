import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cart, total, loading } = useCart();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-lime-500 mb-4"></div>
        <p className="text-lg font-medium">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* 🛍️ Header */}
      <header className="border-b border-gray-300 py-6 px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-7 h-7 text-lime-600" />
          <h1 className="font-extrabold text-2xl tracking-tight">Your Cart</h1>
        </div>
        <Link
          to="/"
          className="text-sm font-semibold text-gray-700 hover:text-lime-600 transition-colors"
        >
          ← Continue Shopping
        </Link>
      </header>

      {/* 🧾 Cart Section */}
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        {cart.length === 0 ? (
          <div className="text-center py-16 border border-gray-200 rounded-xl bg-gray-50">
            <p className="text-gray-600 text-lg mb-4 font-medium">
              Your cart is empty.
            </p>
            <Link
              to="/"
              className="bg-black hover:bg-lime-500 hover:text-black text-white px-8 py-3 rounded-lg inline-block transition-all font-semibold"
            >
              Go Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* 🛒 Cart Items */}
            <div className="space-y-4 mb-10">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-xl bg-gray-50 p-5 hover:shadow-lg transition-all"
                >
                  <CartItem item={item} />
                </div>
              ))}
            </div>

            {/* 💰 Total + Checkout */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-xl font-semibold">Total</p>
                <p className="text-2xl font-bold text-lime-600">
                  ₹{total?.toFixed(2) || "0.00"}
                </p>
              </div>
              <Link
                to="/checkout"
                className="bg-black hover:bg-lime-500 hover:text-black text-white px-8 py-3 rounded-lg inline-block w-full sm:w-auto text-center font-semibold transition-all"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>

        <footer className="text-center border-t border-gray-200 py-8">
          <p className="text-gray-500 text-sm">
          Verve. Be the vibe. 🛍️
          </p>
        </footer>
    </div>
  );
}
