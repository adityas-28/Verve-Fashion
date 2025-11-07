import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, total, loading } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty.</p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block transition-colors"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center mb-6">
              <p className="text-xl font-semibold">Total:</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{total?.toFixed(2) || "0.00"}
              </p>
            </div>
            <Link
              to="/checkout"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg inline-block w-full sm:w-auto text-center transition-colors font-semibold"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
