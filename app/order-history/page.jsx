"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Contact from "../components/Contact";
import { dishes } from "../data/data"; // import your dishes

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        console.log("Orders from API:", data);

        if (Array.isArray(data)) {
          setOrders(data);
        }
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      }
    };
    fetchOrders();
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

  // 🔹 Format currency safely
  const formatCurrency = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "0.00";
    return num.toFixed(2);
  };

  // 🔹 Find dish image by name
  const findDishImage = (itemName) => {
    const dish = dishes.find((d) =>
      itemName.toLowerCase().includes(d.name.toLowerCase())
    );
    return dish ? dish.img : "/images/placeholder.jpg"; // fallback if no match
  };

  return (
    <>
      <Navbar />
      <div className="mt-24 px-6 md:px-20 pb-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order History</h1>

        <div className="space-y-4">
          {orders.map((order, idx) => {
            const items = order.Items?.split(", ") || [];
            const firstTwo = items.slice(0, 2);

            return (
              <details
                key={idx}
                className="border border-gray-200 rounded-2xl bg-white shadow-md overflow-hidden"
              >
                {/* Summary row styled as card header */}
                <summary className="cursor-pointer flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition">
                  {/* Left: Thumbnails */}
                  <div className="flex items-center gap-3">
                    {firstTwo.map((item, i) => (
                      <img
                        key={i}
                        src={findDishImage(item)}
                        alt={item}
                        className="w-12 h-12 object-cover rounded-lg border"
                      />
                    ))}
                    {items.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{items.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Right: Date, Total */}
                  <div className="text-right space-y-1">
                    <p className="text-sm text-gray-600">
                      {order.Timestamp
                        ? new Date(order.Timestamp).toLocaleDateString()
                        : "Unknown Date"}
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      £{formatCurrency(order.Total)}
                    </p>
                  </div>
                </summary>

                {/* Expanded Details */}
                <div className="p-6 border-t border-gray-100 space-y-4">
                  {/* Items with images */}
                  <div className="space-y-4">
                    {items.map((item, index) => (
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
                      <span>£{formatCurrency(order.Subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>£{formatCurrency(order["Delivery fee"])}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-800 text-lg">
                      <span>Total</span>
                      <span>£{formatCurrency(order.Total)}</span>
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </div>
      <Contact />
    </>
  );
}
