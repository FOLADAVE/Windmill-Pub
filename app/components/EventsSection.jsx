"use client";
import React, { useState } from "react";

export default function EventsSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="events" className="bg-gray-50 py-16 px-6 lg:px-20 text-center">
      {/* 🎟 Ticket Button */}
      <div className="mb-12">
        <a
          href="https://www.eventbrite.com/e/naija-dinner-with-d-premiumliveband-tickets-1588332197359?aff=oddtdtcreator"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-red-600 text-white font-bold text-xl px-10 py-5 rounded-2xl shadow-lg hover:bg-red-700 transition"
        >
          🎟 Get Your Tickets
        </a>
      </div>

      {/* Section Title */}
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
        Upcoming Event
      </h2>
      <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10">
        Join us for the{" "}
        <span className="font-semibold">
          Naija Dinner with D Premium Live Band
        </span>
        . Good food, live music, and an unforgettable evening!
      </p>

      {/* ✅ Eventbrite Embed */}
      <div className="max-w-3xl mx-auto mb-16">
        <iframe
          src="https://www.eventbrite.com/e/naija-dinner-with-d-premiumliveband-tickets-1588332197359?aff=oddtdtcreator"
          frameBorder="0"
          className="w-full h-[600px] rounded-xl shadow-md"
          allow="clipboard-write"
        ></iframe>
      </div>

      {/* 🎥 Small Video Thumbnail */}
      <div
        className="max-w-sm mx-auto cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <video
            src="/event.mp4"
            className="w-full h-auto rounded-xl shadow-md"
            muted
          ></video>
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
            <div className="bg-white text-black rounded-full p-4 text-2xl font-bold shadow-lg">
              ▶
            </div>
          </div>
        </div>
      </div>

      {/* 🎬 Fullscreen Video Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="relative w-[90%] max-w-2xl mx-auto px-4">
            <video
              src="/event.mp4"   // ✅ fixed filename (use the same event.mp4)
              className="w-full max-h-[70vh] rounded-xl shadow-lg"
              controls          // ✅ allows pause/play/volume
              autoPlay
            ></video>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-red-500"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
