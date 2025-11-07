import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";

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
    <div className="border border-black rounded-xl bg-white p-5 mb-4 hover:shadow-[4px_4px_0px_#A3E635] transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* 🧢 Product Info */}
        <div className="flex items-center gap-4 flex-1">
          {/* Thumbnail */}
          <div className="w-24 h-24 bg-gray-100 border border-black rounded-lg flex items-center justify-center overflow-hidden">
            {item.image ? (
              <img
                src={
                  item.image.startsWith("http")
                    ? item.image
                    : `Public/images/${item.image}.jpg`
                }
                alt={item.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-400 text-3xl">👕</span>
            )}
          </div>

          {/* Details */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight">
              {item.name || "Product"}
            </h3>
            <p className="text-gray-700 text-sm">
              Price:{" "}
              <span className="font-semibold">₹{item.price?.toFixed(2)}</span>
            </p>
            <p className="text-gray-700 text-sm">
              Subtotal:{" "}
              <span className="text-lime-600 font-bold">
                ₹{itemTotal.toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        {/* 🧮 Quantity Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-black rounded-full px-3 py-1 bg-white">
            <button
              className="p-1.5 rounded-full hover:bg-lime-100 text-black disabled:opacity-50"
              onClick={() => handleUpdateQty((item.qty || 0) - 1)}
              disabled={updating || removing || (item.qty || 0) <= 1}
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center font-semibold">
              {item.qty || 0}
            </span>
            <button
              className="p-1.5 rounded-full hover:bg-lime-100 text-black disabled:opacity-50"
              onClick={() => handleUpdateQty((item.qty || 0) + 1)}
              disabled={updating || removing}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* 🗑️ Remove Button */}
          <button
            onClick={handleRemove}
            disabled={removing || updating}
            className="flex items-center gap-1.5 bg-black text-white hover:bg-lime-400 hover:text-black px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
          >
            {removing ? (
              <span className="animate-pulse text-gray-300">Removing...</span>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Remove</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
