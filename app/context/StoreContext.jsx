"use client";
import { createContext, useState } from "react";
import { dishes } from "../data/data";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  // Add item to cart
  const addToCart = (id) => {
    const key = id.toString();
    setCartItems((prev) => ({
      ...prev,
      [key]: prev[key] ? prev[key] + 1 : 1,
    }));
    console.log("Added to cart:", id);
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    const key = id.toString();
    setCartItems((prev) => {
      if (!prev[key]) return prev;
      const newCart = { ...prev };
      newCart[key] -= 1;
      if (newCart[key] <= 0) delete newCart[key];
      return newCart;
    });
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    return Object.keys(cartItems).reduce((total, key) => {
      const dish = dishes.find((d) => d.id.toString() === key);
      return total + (dish ? dish.price * cartItems[key] : 0);
    }, 0);
  };

  return (
    <StoreContext.Provider
      value={{ cartItems, addToCart, removeFromCart, getTotalCartAmount, dishes }}
    >
      {children}
    </StoreContext.Provider>
  );
};
