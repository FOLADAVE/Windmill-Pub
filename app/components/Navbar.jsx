"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import LoginPopup from "../signin/page";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: session, status } = useSession();

  const user = session?.user;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-200 text-green-700">
        {/* Logo */}
        <Link href="/" className="cursor-pointer">
          <Image
            src="/images/windmill.png"
            alt="Windmill Pub Logo"
            width={110}
            height={60}
            sizes="(max-width: 768px) 100px, 120px"
            className="object-contain w-24 md:w-28"
          />
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-10 font-medium text-[16px]">
          {["Home", "Menu", "About", "Contact"].map((link) => (
            <Link
              key={link}
              href={`/#${link}`}
              className="relative group hover:text-green-900 transition"
            >
              {link}
              {link === "Home" && (
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-green-700 transition-all duration-300 group-hover:w-full"></span>
              )}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 md:gap-6 text-green-700 text-lg relative">
          {/* Search */}
          <button className="hover:opacity-80 transition">
            <Image
              src="/images/loupe.png"
              alt="Search"
              width={22}
              height={22}
              sizes="22px"
            />
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="hover:opacity-80 transition flex items-center"
          >
            <Image
              src="/images/bags-shoppin.png"
              alt="Cart"
              width={28}
              height={28}
              sizes="28px"
            />
          </Link>

          {/* User Auth */}
          {status === "loading" ? (
            <p className="text-sm">Loading...</p>
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-green-700 hover:ring-2 hover:ring-green-300 transition"
              >
                <Image
                  src={user.image || "/images/default-avatar.png"}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  sizes="36px"
                  className="object-cover w-full h-full"
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white shadow-lg rounded-xl border border-gray-100 z-50 animate-fadeIn">
                  <p className="px-4 py-3 text-sm font-semibold text-gray-700 border-b">
                    Hi, {user.name?.split(" ")[0] || "User"}
                  </p>
                 
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-4 py-1.5 border text-sm md:text-[16px] border-green-700 rounded-full font-medium hover:bg-green-700 hover:text-white transition"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Login Popup with blur background */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogin(false)}
          ></div>

          {/* Popup */}
          <div className="relative z-50">
            <LoginPopup setShowLogin={setShowLogin} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
