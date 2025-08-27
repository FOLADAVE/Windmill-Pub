"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function About() {
  const images = [
    "/images/DSC_6427.jpg",
    "/images/DSC_6228.jpg",
    "/images/DSC_6234.jpg",
    "/images/DSC_6230.jpg",
    "/images/DSC_6257.jpg",
    "/images/DSC_6258.jpg",
    "/images/DSC_6466.jpg",
    "/images/DSC_6476.jpg",
    "/images/DSC_6498.jpg",
    "/images/DSC_6450.jpg",
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12" id="About">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left Content */}
        <div>
          <h3 className="text-green-600 font-semibold mb-2">The Story Behind the Flavor</h3>
          <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
            The Windmill Pub Restaurant
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The Windmill Pub Restaurant in Actonne, London, offers a quintessential pub dining
             experience with a diverse menu that spans traditional British and Irish dishes. 
             Popular among patrons are the Boiled Bacon and Cabbage, Shepherd's Pie, Roast Leg of Lamb and Mint Sauce, and Bangers and Mash. 
          </p>
        </div>

        {/* Right Slider */}
        <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-2xl shadow-lg">
          {images.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

          {/* Navigation buttons */}
          <button
            onClick={() =>
              setCurrent((current - 1 + images.length) % images.length)
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrent((current + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow"
          >
            ›
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  index === current ? "bg-red-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
