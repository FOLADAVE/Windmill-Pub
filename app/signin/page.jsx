"use client";
import { useState } from "react";
import Image from "next/image";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");
  const [user, setUser] = useState(null); // store user info

  // This function will handle Google login success
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      // Decode the JWT credential returned from Google
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded User:", decoded);

      // Save user info in state (you can also save to localStorage or backend)
      setUser(decoded);

      // Close popup
      setShowLogin(false);
    } catch (err) {
      console.error("JWT Decode Error:", err);
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <form className="bg-white w-[90%] max-w-xs p-6 rounded-lg shadow-lg flex flex-col gap-4 animate-fadeIn">
        {/* Title */}
        <div className="flex justify-between items-center text-black">
          <h2 className="text-xl font-semibold">
            {user ? `Welcome, ${user.name}` : currState}
          </h2>
          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className="hover:opacity-70"
          >
            <Image src="/images/close.png" alt="Close" width={20} height={20} />
          </button>
        </div>

        {/* Show user info if logged in */}
        {user ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <Image
              src={user.picture}
              alt={user.name}
              width={60}
              height={60}
              className="rounded-full"
            />
            <p className="text-gray-700">{user.email}</p>
          </div>
        ) : (
          <>
            {/* Inputs */}
            <div className="flex flex-col gap-3">
              {currState === "Login" ? null : (
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
                />
              )}
              <input
                type="email"
                placeholder="Your email"
                required
                className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
              />
              <input
                type="password"
                placeholder="Password"
                required
                className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition"
            >
              {currState === "Sign Up" ? "Create Account" : "Login"}
            </button>

            {/* OR Separator */}
            <div className="flex items-center gap-2 text-gray-400 text-sm my-2">
              <hr className="flex-1" />
              <span>OR</span>
              <hr className="flex-1" />
            </div>

            {/* Google Login Button */}
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            {/* Checkbox */}
            <div className="flex items-start gap-2 text-gray-600 text-xs mt-2">
              <input type="checkbox" required className="mt-1" />
              <p>By continuing, I agree to the terms of use & privacy policy.</p>
            </div>

            {/* Switch Login / Sign Up */}
            {currState === "Login" ? (
              <p className="text-sm mt-2">
                Create a new account?{" "}
                <span
                  onClick={() => setCurrState("Sign Up")}
                  className="text-green-700 font-medium cursor-pointer hover:underline"
                >
                  Click here
                </span>
              </p>
            ) : (
              <p className="text-sm mt-2">
                Already have an account?{" "}
                <span
                  onClick={() => setCurrState("Login")}
                  className="text-green-700 font-medium cursor-pointer hover:underline"
                >
                  Login here
                </span>
              </p>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
