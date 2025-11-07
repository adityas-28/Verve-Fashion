import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { updateCartItem, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleUpdateQty = async (newQty) => {
    if (newQty <= 0) {
      handleRemove();
      return;
    }
    try {
      setUpdating(true);
      await updateCartItem(item.id, newQty);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      await removeFromCart(item.id);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to remove item");
    } finally {
      setRemoving(false);
    }
  };

  const itemTotal = (item.price || 0) * (item.qty || 0);

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">
            {item.name || "Product"}
          </h3>
          <p className="text-gray-600">
            Price: ₹{item.price?.toFixed(2) || "0.00"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Qty:</label>
            <button
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
              onClick={() => handleUpdateQty((item.qty || 0) - 1)}
              disabled={updating || removing || (item.qty || 0) <= 1}
            >
              −
            </button>
            <span className="w-12 text-center font-semibold">
              {item.qty || 0}
            </span>
            <button
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
              onClick={() => handleUpdateQty((item.qty || 0) + 1)}
              disabled={updating || removing}
            >
              +
            </button>
          </div>

          <div className="text-right">
            <p className="font-bold text-lg">₹{itemTotal.toFixed(2)}</p>
          </div>

          <button
            className="text-red-600 hover:text-red-700 px-3 py-1 rounded disabled:opacity-50"
            onClick={handleRemove}
            disabled={removing || updating}
          >
            {removing ? "..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
