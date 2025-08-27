"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { StoreContext } from "../context/StoreContext";

const TopDishes = ({ selectedCategory }) => {
  const { cartItems, addToCart, removeFromCart, dishes } = useContext(StoreContext);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  const filteredDishes = selectedCategory
    ? dishes.filter((d) => d.category === selectedCategory)
    : dishes;

  return (
    <div className="container mx-auto px-4">
      <section className="py-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-green-600 text-center">
          {selectedCategory ? `${selectedCategory} Dishes` : "Top dishes near you"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => {
            const quantity = cartItems[dish.id.toString()] || 0;

            return (
              <div key={dish.id} className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="relative w-full h-48">
                  <Image src={dish.img} alt={dish.name} fill className="object-cover" />

                  {!quantity ? (
                    <button
                      onClick={() => addToCart(dish.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
                    >
                      +
                    </button>
                  ) : (
                    <div className="absolute top-2 right-2 flex items-center bg-white rounded-full p-1 shadow">
                      <button onClick={() => removeFromCart(dish.id)} className="px-2">
                        -
                      </button>
                      <span className="px-2">{quantity}</span>
                      <button onClick={() => addToCart(dish.id)} className="px-2">
                        +
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg">{dish.name}</h3>
                  <div className="flex items-center text-orange-500 text-sm mb-2">
                    {"★".repeat(dish.rating)}
                    {"☆".repeat(5 - dish.rating)}
                  </div>
                  <p className="text-gray-500 text-sm mb-3">{dish.description}</p>
                  <p className="text-red-500 font-bold text-lg">£{dish.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default TopDishes;
