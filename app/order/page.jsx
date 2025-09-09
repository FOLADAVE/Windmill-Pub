"use client";
import React, { useState, useContext, useMemo } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Contact from "../components/Contact";
import { StoreContext } from "../context/StoreContext";

// ✅ CheckoutButton Component with Success Popup + Auth Check
function CheckoutButton({ handleContinue, loadingSubmit, cartLines }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const { data: session, status } = useSession();

  const handleOrder = async () => {
    try {
      await handleContinue(); // your existing order submission logic
      setShowSuccess(true); // show success popup
    } catch (error) {
      console.error("❌ Order failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative">
      {status === "unauthenticated" ? (
        <button
          onClick={() => signIn()}
          className="mt-6 w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition font-semibold"
        >
          Sign in to place your order
        </button>
      ) : (
        <button
          onClick={handleOrder}
          disabled={loadingSubmit || cartLines.length === 0}
          className="mt-6 w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition font-semibold disabled:opacity-50"
        >
          {loadingSubmit ? "Submitting..." : "Done"}
        </button>
      )}

      {/* ✅ Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center animate-fadeIn">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Order Successful</h2>
            <p className="text-gray-600 mt-2">Your order has been placed successfully!</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-6 w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderPage() {
  const [orderType, setOrderType] = useState(""); // "delivery" | "restaurant"
  const [restaurantOption, setRestaurantOption] = useState(""); // "eat-in" | "take-away"
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const { cartItems, dishes } = useContext(StoreContext);

  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxXtZi1RBExaHC5Ol_g0mXjsDLIj3kHLt49MvtJRq-I018iD2imMzle1SiesYbVxR1e/exec";

  const qtyFor = (id) =>
    cartItems?.[id] ?? cartItems?.[String(id)] ?? 0;

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
  }, [dishes, cartItems]);

  const subtotal = useMemo(
    () => cartLines.reduce((s, l) => s + l.subtotal, 0),
    [cartLines]
  );
  const deliveryFee = orderType === "delivery" && subtotal > 0 ? 2 : 0;
  const total = subtotal + deliveryFee;

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

  const handleContinue = async () => {
    if (!session) {
      alert("Please sign in first to complete your order.");
      router.push("/signin");
      return;
    }

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      console.log("✅ Order submitted (opaque response):", orderData);
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
          {/* ... Delivery & Restaurant Options ... */}
{/* Left: Options */}
<section className="lg:col-span-2 space-y-6">

  {/* Order Type - Professional Card UI */}
  <div className="flex gap-8 mb-8">
    {/* Delivery Card */}
    <div
      onClick={() => setOrderType("delivery")}
      className={`flex-1 cursor-pointer rounded-2xl shadow-md transition border-2 p-6 flex flex-col items-center justify-center
        ${orderType === "delivery" ? "border-green-500 bg-green-50" : "border-gray-200 bg-white hover:shadow-lg"}`}
    >
      <div className="mb-3">
        <span className="inline-block bg-green-100 p-3 rounded-full">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h1l2 7h13l2-7H5" />
            <circle cx="7.5" cy="19.5" r="1.5" />
            <circle cx="17.5" cy="19.5" r="1.5" />
          </svg>
        </span>
      </div>
      <h3 className="text-xl font-bold mb-1 text-gray-800">Delivery</h3>
      <p className="text-gray-600 text-center mb-2">We’ll deliver straight to your doorstep.</p>
      {orderType === "delivery" && (
        <span className="mt-2 px-4 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">Selected</span>
      )}
    </div>

    {/* Restaurant Card */}
    <div
      onClick={() => setOrderType("restaurant")}
      className={`flex-1 cursor-pointer rounded-2xl shadow-md transition border-2 p-6 flex flex-col items-center justify-center
        ${orderType === "restaurant" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:shadow-lg"}`}
    >
      <div className="mb-3">
        <span className="inline-block bg-blue-100 p-3 rounded-full">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </span>
      </div>
      <h3 className="text-xl font-bold mb-1 text-gray-800">At Restaurant</h3>
      <p className="text-gray-600 text-center mb-2">Eat in with us or take it away.</p>
      {orderType === "restaurant" && (
        <span className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-full text-xs font-semibold">Selected</span>
      )}
    </div>
  </div>

  {/* Delivery Details */}
  {orderType === "delivery" && (
    <div className="p-6 border border-gray-200 rounded-2xl bg-white space-y-4">
      <h3 className="text-lg font-semibold">Delivery Details</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border rounded-xl p-3"
          placeholder="Enter your delivery address"
          rows="2"
        />
        <button
          onClick={handleUseLocation}
          disabled={loadingLocation}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          {loadingLocation ? "Fetching location..." : "Use current location"}
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded-xl p-3"
          placeholder="Enter your phone number"
        />
      </div>
    </div>
  )}

  {/* Restaurant Options */}
  {orderType === "restaurant" && (
    <div className="p-6 border border-gray-200 rounded-2xl bg-white">
      <h3 className="text-lg font-semibold mb-4">At Restaurant</h3>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="restaurantOption"
            value="eat-in"
            checked={restaurantOption === "eat-in"}
            onChange={() => setRestaurantOption("eat-in")}
            className="accent-blue-500"
          />
          Eat In
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="restaurantOption"
            value="take-away"
            checked={restaurantOption === "take-away"}
            onChange={() => setRestaurantOption("take-away")}
            className="accent-blue-500"
          />
          Take Away
        </label>
      </div>
    </div>
  )}
</section>

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

            <CheckoutButton
              handleContinue={handleContinue}
              loadingSubmit={loadingSubmit}
              cartLines={cartLines}
            />

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
