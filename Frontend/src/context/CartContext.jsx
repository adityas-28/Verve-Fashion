import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/apiClient";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/cart");
      setCart(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch cart");
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, qty = 1) => {
    try {
      await api.post("/cart", { productId, qty });
      await fetchCart();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add to cart");
      throw err;
    }
  };

  const updateCartItem = async (cartId, qty) => {
    try {
      await api.put(`/cart/${cartId}`, { qty });
      await fetchCart();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update cart");
      throw err;
    }
  };

  const removeFromCart = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      await fetchCart();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to remove from cart");
      throw err;
    }
  };

  const checkout = async (name, email) => {
    try {
      const res = await api.post("/checkout", { name, email });
      await fetchCart(); // Refresh cart (should be empty now)
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "Checkout failed");
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        checkout,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
