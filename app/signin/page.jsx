"use client";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function LoginPopup({ setShowLogin }) {
  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowLogin(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setShowLogin]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={() => setShowLogin(false)}
      />

      {/* Modal Content */}
      <div
        className="relative z-50 bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-fadeIn"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={() => setShowLogin(false)}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          ✕
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h1>
        <p className="text-gray-600 mb-8">
          Sign in to order your favorite meals
        </p>

        {/* Google Sign In Button */}
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl shadow-md transition cursor-pointer"
        >
          {/* Google SVG Logo */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
            className="w-6 h-6"
          >
            <path
              fill="#4285F4"
              d="M488 261.8c0-17.8-1.6-35-4.6-51.8H249v97.9h134.7c-5.8 31.2-23.2 57.6-49.2 75.3v62.6h79.2c46.4-42.7 73.3-105.5 73.3-183z"
            />
            <path
              fill="#34A853"
              d="M249 492c66.2 0 121.7-21.9 162.3-59.4l-79.2-62.6c-22 15-50.2 24-83.1 24-63.9 0-118-43.1-137.4-101.2h-81v63.8C71.4 445.2 154.5 492 249 492z"
            />
            <path
              fill="#FBBC05"
              d="M111.6 293.8c-4.8-14.2-7.6-29.4-7.6-45s2.7-30.8 7.6-45V140h-81C18.3 176.9 0 220.8 0 268.8s18.3 91.9 50.6 128.8l61-47.8z"
            />
            <path
              fill="#EA4335"
              d="M249 97.8c35.9 0 68 12.4 93.3 36.9l69.9-69.9C370.7 24.3 315.2 0 249 0 154.5 0 71.4 46.8 29.6 118.8l81 63.8C131 141 185.1 97.8 249 97.8z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="mt-8">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-red-500 hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-red-500 hover:underline">
              Privacy Policy
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
