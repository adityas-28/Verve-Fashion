import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart, total } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/"
            className="font-bold text-2xl hover:text-blue-200 transition-colors"
          >
            🛍️ E-Commerce
          </Link>
          <div className="flex gap-6 items-center">
            <Link
              to="/"
              className="hover:text-blue-200 transition-colors font-medium"
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="hover:text-blue-200 transition-colors font-medium flex items-center gap-2"
            >
              <span>🛒 Cart</span>
              {cartItemCount > 0 && (
                <span className="bg-white text-blue-600 px-2 py-1 rounded-full text-sm font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {total > 0 && (
              <span className="text-sm bg-blue-700 px-3 py-1 rounded">
                ₹{total.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
