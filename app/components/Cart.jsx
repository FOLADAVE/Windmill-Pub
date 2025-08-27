"use client";
import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../context/StoreContext";
import { useRouter } from "next/navigation";

const Carts = () => {
  const { cartItems, removeFromCart, getTotalCartAmount, dishes } = useContext(StoreContext);
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  const cartDishes = dishes.filter((dish) => cartItems[dish.id.toString()] > 0);
  const deliveryFee = getTotalCartAmount() === 0 ? 0 : 2;
  const totalAmount = getTotalCartAmount() + deliveryFee;

  return (
    <div className="mt-24 px-4">
      <div className="w-full">
        <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_0.5fr] items-center text-gray-500 text-sm font-semibold">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <hr className="my-2 border-gray-200" />

        {cartDishes.length === 0 && (
          <p className="text-center text-gray-500 mt-4">Your cart is empty.</p>
        )}

        {cartDishes.map((dish) => (
          <div key={dish.id}>
            <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_0.5fr] items-center text-black text-sm my-2">
              <img src={dish.img} alt={dish.name} className="w-12" />
              <p>{dish.name}</p>
              <p>£{dish.price}</p>
              <p>{cartItems[dish.id.toString()]}</p>
              <p>£{dish.price * cartItems[dish.id.toString()]}</p>
              <p
                onClick={() => removeFromCart(dish.id)}
                className="cursor-pointer text-red-500 font-bold"
              >
                x
              </p>
            </div>
            <hr className="border-gray-200" />
          </div>
        ))}
      </div>

      <div className="mt-20 flex flex-col md:flex-row justify-between gap-8">
        <div className="flex-1 flex flex-col gap-5">
          <h2 className="text-xl font-bold">Cart Total</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <p>Subtotal</p>
              <p>£{getTotalCartAmount()}</p>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-gray-600">
              <p>Delivery Fee</p>
              <p>£{deliveryFee}</p>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <p>Total</p>
            <p>£{totalAmount}</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/order")}
            className="bg-green-500 text-white py-3 rounded-md w-[200px] hover:bg-red-600 transition"
          >
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carts;
