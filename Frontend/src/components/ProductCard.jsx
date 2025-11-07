import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(product.id, 1);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="border border-gray-200 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow bg-white">
      <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center mb-4">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="text-gray-400 text-4xl">📦</div>
        )}
      </div>
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
        {product.name}
      </h3>
      <p className="text-gray-700 text-xl font-bold mb-4">
        ₹{product.price?.toFixed(2) || "0.00"}
      </p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleAddToCart}
        disabled={adding}
      >
        {adding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}
