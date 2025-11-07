import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import ReceiptModal from "../components/ReceiptModal";
import { ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { cart, total, checkout, loading } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Avoid redirecting after successful checkout so the receipt can show
    if (cart.length === 0 && !loading && !receipt && !submitting) {
      navigate("/cart");
    }
  }, [cart, loading, receipt, submitting, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const data = await checkout(form.name, form.email);
      // Support both { receipt: {...} } and direct receipt object
      setReceipt(data?.receipt ?? data ?? null);
    } catch (err) {
      setError(
        err.response?.data?.error || "Checkout failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-lime-500 mb-4"></div>
        <p className="text-base font-medium">Preparing checkout...</p>
      </div>
    );
  }

  // Do not early-return on empty cart; we still want to show the receipt

  return (
    <div className="min-h-screen bg-white text-black">
      {/* 🛍 Header */}
      <header className="border-b border-gray-300 py-6 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-7 h-7 text-lime-600" />
          <h1 className="text-2xl font-extrabold tracking-tight">Checkout</h1>
        </div>
        <button
          onClick={() => navigate("/cart")}
          className="text-sm font-semibold text-gray-700 hover:text-lime-600 transition-colors"
        >
          ← Back to Cart
        </button>
      </header>

      {/* 💳 Checkout Container */}
      <div className="container mx-auto px-6 py-10 max-w-2xl">
        {!receipt ? (
          <div className="border border-gray-200 rounded-2xl bg-gray-50 p-8 shadow-sm">
            {/* 🧾 Order Summary */}
            <div className="mb-8">
              <h3 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="font-medium">
                      {item.name} × {item.qty}
                    </span>
                    <span>
                      ₹{((item.price || 0) * (item.qty || 0)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-lime-600">
                  ₹{total?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>

            {/* 🧍‍♂️ Buyer Info */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black hover:bg-lime-500 hover:text-black text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>
        ) : (
          <ReceiptModal receipt={receipt} />
        )}
      </div>
    </div>
  );
}
