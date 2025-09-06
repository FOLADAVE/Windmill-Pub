"use client";
import React, { useState, useContext, useMemo } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import Contact from "../components/Contact";
import { StoreContext } from "../context/StoreContext";

export default function OrderPage() {
  const [orderType, setOrderType] = useState(""); // "delivery" | "restaurant"
  const [restaurantOption, setRestaurantOption] = useState(""); // "eat-in" | "take-away"
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const { data: session } = useSession();
  const { cartItems, dishes } = useContext(StoreContext);

  // Replace with your deployed Apps Script web app URL
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzX02QFh-DWHpP8ZeECDqz8F3VfDSY8kXUdf1uvM7q0mfXKTOYY1mxItrj5MRbvYnJt/exec";

  // Helper: quantity for an id (cartItems may have string keys)
  const qtyFor = (id) =>
    cartItems?.[id] ?? cartItems?.[String(id)] ?? 0;

  // Build cart lines
  const cartLines = useMemo(() => {
    if (!dishes || !cartItems) return [];
    return dishes
      .filter((d) => qtyFor(d.id) > 0)
      .map((d) => ({
        id: d.id,
        name: d.name,
        qty: qtyFor(d.id),
        price: Number(d.price) || 0,
        subtotal: (Number(d.price) || 0) * qtyFor(d.id),
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dishes, cartItems]);

  const subtotal = useMemo(
    () => cartLines.reduce((s, l) => s + l.subtotal, 0),
    [cartLines]
  );
  const deliveryFee = orderType === "delivery" && subtotal > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

  // Use browser geolocation + Nominatim reverse geocode
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by your browser.");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data?.display_name) setAddress(data.display_name);
          else setAddress(`Lat: ${latitude}, Lng: ${longitude}`);
        } catch (err) {
          console.error("Reverse geocode error:", err);
          alert("Could not fetch address from coordinates.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Unable to fetch location.");
        setLoadingLocation(false);
      }
    );
  };

  // Submit order
  const handleContinue = async () => {
    if (cartLines.length === 0) {
      alert("Your cart is empty. Add items before checking out.");
      return;
    }
    if (!orderType) {
      alert("Please select Delivery or At Restaurant.");
      return;
    }
    if (orderType === "delivery" && (!address || !phone)) {
      alert("Please provide both delivery address and phone number.");
      return;
    }
    if (orderType === "restaurant" && !restaurantOption) {
      alert("Please choose Eat In or Take Away.");
      return;
    }

    const orderData = {
      userName: session?.user?.name || "Guest",
      userEmail: session?.user?.email || "",
      orderType,
      restaurantOption: orderType === "restaurant" ? restaurantOption : "",
      address: orderType === "delivery" ? address : "",
      phone: orderType === "delivery" ? phone : "",
      timestamp: new Date().toISOString(),

      items: cartLines,
      itemsList: cartLines.map((l) => `${l.name} (x${l.qty})`).join(", "),

      subtotal,
      deliveryFee,
      total,
    };

    try {
      setLoadingSubmit(true);

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(orderData),
      });

      console.log("✅ Order submitted:", orderData);
      alert("Order submitted successfully! Check the console for details.");
    } catch (err) {
      console.error("❌ Submit error:", err);
      alert("Could not submit order. Try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mt-24 px-6 md:px-20 pb-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Choose How to Get Your Order
        </h1>

        {session && (
          <div className="mb-6 text-gray-700">
            Signed in as{" "}
            <span className="font-semibold">
              {session.user.name || "Guest"}
            </span>{" "}
            {session.user.email && <span>({session.user.email})</span>}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery option */}
            <div
              onClick={() => {
                setOrderType("delivery");
                setRestaurantOption("");
              }}
              className={`p-6 rounded-2xl shadow-md cursor-pointer transition ${
                orderType === "delivery"
                  ? "border-2 border-green-500 bg-green-50"
                  : "border border-gray-200 hover:shadow-lg"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">🚚 Delivery</h2>
              <p className="text-gray-600 mb-3">
                We’ll deliver straight to your doorstep.
              </p>

              {orderType === "delivery" && (
                <div
                  className="mt-2 space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label className="block text-sm text-gray-700">
                    Delivery address
                  </label>
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter delivery address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                  />

                  <label className="block text-sm text-gray-700">Phone</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
                  />

                  <div className="flex gap-3 items-center">
                    <button
                      onClick={handleUseLocation}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm"
                    >
                      {loadingLocation ? "Fetching..." : "📍 Use Current Location"}
                    </button>
                    <span className="text-sm text-gray-500">
                      or type address manually
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Restaurant option */}
            <div
              onClick={() => setOrderType("restaurant")}
              className={`p-6 rounded-2xl shadow-md cursor-pointer transition ${
                orderType === "restaurant"
                  ? "border-2 border-green-500 bg-green-50"
                  : "border border-gray-200 hover:shadow-lg"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">🍽️ At Restaurant</h2>
              <p className="text-gray-600 mb-3">
                Eat in with us or take it away.
              </p>

              {orderType === "restaurant" && (
                <div
                  className="mt-2 flex gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setRestaurantOption("eat-in")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      restaurantOption === "eat-in"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    Eat In
                  </button>
                  <button
                    onClick={() => setRestaurantOption("take-away")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      restaurantOption === "take-away"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    Take Away
                  </button>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <label className="text-sm font-medium text-gray-700">
                Order notes (optional)
              </label>
              <textarea
                placeholder="Extra instructions for the kitchen or driver"
                className="w-full mt-2 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            </div>
          </div>

          {/* Right: Order summary */}
          <aside className="p-6 border border-gray-200 rounded-2xl h-fit bg-white">
            <h3 className="text-lg font-semibold mb-4">Your order</h3>

            {cartLines.length === 0 ? (
              <p className="text-gray-500 mb-4">Cart is empty.</p>
            ) : (
              <div className="space-y-3 mb-4">
                {cartLines.map((line) => (
                  <div
                    key={line.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      <div className="font-medium">{line.name}</div>
                      <div className="text-xs text-gray-500">
                        x{line.qty} — £{line.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="font-semibold">
                      £{line.subtotal.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <span>£{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 text-lg">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={loadingSubmit || cartLines.length === 0}
              className="mt-6 w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition font-semibold disabled:opacity-50"
            >
              {loadingSubmit ? "Submitting..." : "Done"}
            </button>

            <p className="mt-3 text-xs text-gray-500">
              After you continue we'll save your order and log details in console.
            </p>
          </aside>
        </div>
      </main>

      <Contact />
    </>
  );
}