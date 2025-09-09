"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Contact from "../components/Contact";
import { dishes } from "../data/data"; // import your dishes

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("orders");
    if (stored) {
      setOrders(JSON.parse(stored));
    } else {
      const latestOrder = localStorage.getItem("latestOrder");
      if (latestOrder) {
        setOrders([JSON.parse(latestOrder)]);
      }
    }
  }, []);

  if (!orders || orders.length === 0) {
    return (
      <>
        <Navbar />
        <div className="mt-24 px-6 md:px-20 pb-16">
          <div className="p-6 text-center text-gray-600">No recent orders.</div>
        </div>
        <Contact />
      </>
    );
  }

  // helper to find dish image by name
  const findDishImage = (itemName) => {
    const dish = dishes.find((d) => itemName.includes(d.name));
    return dish ? dish.img : "/images/placeholder.jpg"; // fallback if no match
  };

  return (
    <>
      <Navbar />
      <div className="mt-24 px-6 md:px-20 pb-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order History</h1>

        <div className="space-y-4">
          {orders.map((order, idx) => (
            <details
              key={idx}
              className="border border-gray-200 rounded-2xl bg-white shadow-md"
            >
              <summary className="cursor-pointer p-4 flex justify-between items-center">
                <span className="font-medium text-gray-800">
                  Order #{idx + 1}
                </span>
              </summary>

              <div className="p-6 border-t border-gray-100 space-y-4">
                {/* Items with images */}
                <div className="space-y-4">
                  {order.itemsList
                    ?.split(", ")
                    .map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={findDishImage(item)}
                          alt={item}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <p className="text-sm text-gray-600">{item}</p>
                      </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>£{order.subtotal?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>£{order.deliveryFee?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 text-lg">
                    <span>Total</span>
                    <span>£{order.total?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
      <Contact />
    </>
  );
}
