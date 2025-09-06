"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

// 🔑 AdminPanel Component
function AdminPanel({ onSignOut }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle
  const ordersPerPage = 5;

  // ✅ Fetch orders from Google Sheets (via Apps Script doGet)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbzX02QFh-DWHpP8ZeECDqz8F3VfDSY8kXUdf1uvM7q0mfXKTOYY1mxItrj5MRbvYnJt/exec"
        );
        const data = await res.json();

        // Transform rows into your table structure
        const mappedOrders = data.map((row, index) => ({
          id: index + 1,
          orderTime: row["Timestamp"] || "",
          restaurantType: row["Restaurant type"] || "",
          orderOption: row["Order option"] || "",
          address: row["Address"] || "",
          phone: row["Phone"] || "",
          userName: row["Name"] || "",
          userEmail: row["Email"] || "",
          items: (row["Item"] || "").split(",").map((item) => item.trim()),
          subtotal: parseFloat(row["Subtotal"] || 0),
          deliveryFee: parseFloat(row["Delivery fee"] || 0),
          total: parseFloat(row["Total"] || 0),
        }));

        setOrders(mappedOrders);
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-gray-700">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar - desktop */}
      <aside className="hidden md:block w-64 bg-white shadow-lg p-4">
        <div className="flex items-center gap-3 mb-6">
          <Image
            src="/images/windmill.png"
            alt="Logo"
            width={70}
            height={70}
            className="cursor-pointer rounded-full"
          />
          <span className="text-lg font-bold text-gray-700">Admin Panel</span>
        </div>
        <nav className="space-y-2">
          <a
            href="#"
            className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Image
              src="/images/orderr.png"
              alt="Orders"
              width={40}
              height={40}
              className="mr-2"
            />
            Orders
          </a>
        </nav>
      </aside>

      {/* Sidebar - mobile */}
      {sidebarOpen && (
        <aside className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="w-64 bg-white h-full shadow-lg p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="mb-4 text-gray-500 hover:text-gray-700"
            >
              ✕ Close
            </button>
            <nav className="space-y-2">
              <a
                href="#"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Image
                  src="/images/orderr.png"
                  alt="Orders"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                Orders
              </a>
            </nav>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-800 uppercase text-xs">
                <tr>
                  <th className="px-3 md:px-6 py-3">Order ID</th>
                  <th className="px-3 md:px-6 py-3">User Name</th>
                  <th className="px-3 md:px-6 py-3">Order Time</th>
                  <th className="px-3 md:px-6 py-3">Restaurant Type</th>
                  <th className="px-3 md:px-6 py-3">Order Option</th>
                  <th className="px-3 md:px-6 py-3">Address</th>
                  <th className="px-3 md:px-6 py-3">Phone</th>
                  <th className="px-3 md:px-6 py-3">Items</th>
                  <th className="px-3 md:px-6 py-3">Subtotal</th>
                  <th className="px-3 md:px-6 py-3">Delivery Fee</th>
                  <th className="px-3 md:px-6 py-3">Total</th>
                  <th className="px-3 md:px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="bg-white border-b hover:bg-gray-50 transition">
                      <td className="px-3 md:px-6 py-4">{order.id}</td>
                      <td className="px-3 md:px-6 py-4">{order.userName}</td>
                      <td className="px-3 md:px-6 py-4">
                        {order.orderTime
                          ? new Date(order.orderTime).toLocaleString()
                          : "-"}
                      </td>
                      <td className="px-3 md:px-6 py-4">{order.restaurantType}</td>
                      <td className="px-3 md:px-6 py-4">{order.orderOption || "-"}</td>
                      <td className="px-3 md:px-6 py-4">{order.address || "-"}</td>
                      <td className="px-3 md:px-6 py-4">{order.phone || "-"}</td>
                      <td className="px-3 md:px-6 py-4">
                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="text-green-600 hover:text-orange-800 font-medium"
                        >
                          View Items ({order.items.length})
                        </button>
                      </td>
                      <td className="px-3 md:px-6 py-4">£{order.subtotal.toFixed(2)}</td>
                      <td className="px-3 md:px-6 py-4">£{order.deliveryFee.toFixed(2)}</td>
                      <td className="px-3 md:px-6 py-4 font-bold">
                        £{order.total.toFixed(2)}
                      </td>
                      <td className="px-3 md:px-6 py-4">
                        <button className="text-green-600 hover:text-green-800">
                          View Details
                        </button>
                      </td>
                    </tr>
                    {expandedRow === order.id && (
                      <tr>
                        <td colSpan="12" className="px-3 md:px-6 py-4 bg-gray-50">
                          <ul className="list-disc pl-5 space-y-1">
                            {order.items.map((item, index) => (
                              <li key={index} className="text-gray-700">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <p className="text-center text-gray-500 py-4">No orders found.</p>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 md:px-4 py-2 rounded-lg transition ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white"
                    : "bg-white text-green-600 border border-orange-200 hover:bg-orange-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Header with Avatar and Sign Out */}
      <header className="bg-white shadow-md p-4 flex justify-between md:justify-end items-center fixed top-0 right-0 left-0 md:left-64 z-10">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-900"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>

        <div className="flex items-center space-x-4">
          <img
            src="/images/default-avatar.png"
            alt="Admin Avatar"
            className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-green-500"
          />
          <button
            onClick={onSignOut}
            className="px-3 md:px-4 py-1.5 border text-sm md:text-[16px] border-green-700 rounded-full font-medium hover:bg-green-700 hover:text-white transition"
          >
            Sign Out
          </button>
        </div>
      </header>
    </div>
  );
}

// 🔑 Admin Page Wrapper with Login
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
  try {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.success) {
      setAuthenticated(true);
    } else {
      alert("❌ Wrong password");
    }
  } catch (err) {
    alert("⚠️ Server error, please try again.");
    console.error(err);
  }
};


  const handleSignOut = () => {
    setAuthenticated(false);
    setPassword("");
  };

  if (!authenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="bg-white shadow-xl p-6 md:p-8 rounded-2xl w-11/12 max-w-md border border-gray-100">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/images/windmill-pub.png"
              alt="Logo"
              className="w-14 h-14 md:w-16 md:h-16 rounded-full shadow-md"
            />
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-2">
            Admin Login
          </h2>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Enter your password to access the dashboard
          </p>

          {/* Password Input */}
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none p-3 rounded-lg mb-4 text-gray-700 placeholder-gray-400"
          />

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium text-lg shadow hover:bg-green-700 transition"
          >
            Sign In
          </button>

          {error && <p className="text-red-500 text-center mt-3">{error}</p>}

          {/* Footer */}
          <p className="text-xs text-center text-gray-400 mt-6">
            © {new Date().getFullYear()} Windmill Pub Admin Panel
          </p>
        </div>
      </div>
    );
  }

  return <AdminPanel onSignOut={handleSignOut} />;
}
