import { Link } from "react-router-dom";

export default function ReceiptModal({ receipt }) {
  if (!receipt) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md mx-auto">
      <div className="mb-6">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-3xl font-bold text-green-600 mb-2">
          Order Confirmed!
        </h3>
        <p className="text-gray-600">Thank you for your purchase</p>
      </div>

      <div className="border-t border-b py-6 my-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Order ID:</span>
          <span className="font-mono text-sm">{receipt.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Amount:</span>
          <span className="font-bold text-xl text-green-600">
            ₹{receipt.total?.toFixed(2) || "0.00"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Date:</span>
          <span>{new Date(receipt.timestamp).toLocaleString()}</span>
        </div>
        {receipt.buyer?.name && (
          <div className="flex justify-between">
            <span className="text-gray-600">Buyer:</span>
            <span>{receipt.buyer.name}</span>
          </div>
        )}
      </div>

      {receipt.cartItems && receipt.cartItems.length > 0 && (
        <div className="mb-6 text-left">
          <h4 className="font-semibold mb-2">Items:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {receipt.cartItems.map((item, idx) => (
              <li key={idx}>
                Product {item.productId} × {item.qty}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-block transition-colors font-semibold"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
