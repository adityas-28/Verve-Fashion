import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function ReceiptModal({ receipt }) {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="bg-white border border-black rounded-2xl p-8 w-[90%] sm:w-[420px] shadow-[6px_6px_0px_#A3E635] relative animate-fade-in">
        {/* ✅ Success Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <CheckCircle2 className="text-lime-600 w-16 h-16 mb-3" />
          <h3 className="text-3xl font-extrabold text-black mb-1 uppercase tracking-tight">
            Order Confirmed
          </h3>
          <p className="text-gray-600 text-sm">
            Thank you for shopping with <span className="font-bold">Verve.</span> 💚
          </p>
        </div>

        {/* 🧾 Order Details */}
        <div className="border-y border-black/20 py-5 my-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Order ID</span>
            <span className="font-mono text-gray-800">{receipt.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Total Amount</span>
            <span className="font-bold text-lg text-lime-600">
              ₹{receipt.total?.toFixed(2) || "0.00"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700 font-medium">Date</span>
            <span>{new Date(receipt.timestamp).toLocaleString()}</span>
          </div>
          {receipt.buyer?.name && (
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Buyer</span>
              <span className="text-gray-800 font-semibold">
                {receipt.buyer.name}
              </span>
            </div>
          )}
        </div>

        {/* 🧤 Items List */}
        {receipt.cartItems && receipt.cartItems.length > 0 && (
          <div className="mb-6 text-left">
            <h4 className="font-bold mb-2 text-gray-800">Items:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {receipt.cartItems.map((item, idx) => (
                <li key={idx}>
                  • {item.name || `Product ${item.name}`} × {item.qty}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 🛍 Continue Button */}
        <Link
          to="/"
          className="block text-center w-full bg-black text-white font-semibold py-3 rounded-lg border border-black hover:bg-lime-400 hover:text-black transition-all duration-200"
        >
          Continue Shopping
        </Link>

        {/* 💚 Subtle Glow */}
        <div className="absolute -bottom-2 -right-2 w-full h-full border border-lime-400 rounded-2xl -z-10"></div>
      </div>
    </div>
  );
}
