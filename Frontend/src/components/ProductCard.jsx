import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Heart } from "lucide-react";

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
    <div className="relative border border-black rounded-xl bg-white overflow-hidden hover:-translate-y-1 hover:shadow-[4px_4px_0px_#A3E635] transition-all duration-200">
      {/* 🏷 Tag */}
      {product.featured && (
        <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
          NEW DROP
        </div>
      )}

      {/* 🖼 Product Image */}
      <div className="h-64 bg-gray-100 flex items-center justify-center border-b border-black">
        {product.image ? (
          <img
            src={
              product.image.startsWith("http")
                ? product.image
                : `Public/images/${product.image}.jpg`
            }
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-4xl">👕</div>
        )}
      </div>

      {/* 💬 Product Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold uppercase tracking-tight">
            {product.name}
          </h3>
          {/* <button className="text-gray-400 hover:text-pink-500 transition-colors">
            <Heart size={18} />
          </button> */}
        </div>

        {/* 💰 Price */}
        <p className="text-gray-700 font-semibold mb-4">
          ₹{product.price?.toFixed(2) || "0.00"}
        </p>

        {/* 🛒 Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="w-full bg-black text-white font-semibold py-2.5 rounded-lg border border-black hover:bg-lime-400 hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
