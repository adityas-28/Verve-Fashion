import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-black">
      {/* Top Lime Bar / Logo */}
      <div className="bg-lime-500 text-black font-extrabold text-xl px-6 py-3 flex justify-between items-center">
        <Link to="/" className="tracking-tight">
        VERVE.
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="relative flex items-center gap-2 font-semibold text-black hover:underline underline-offset-4 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-black text-white text-xs font-bold px-2 py-[1px] rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
