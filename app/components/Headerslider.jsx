"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Fresh & Delicious – Taste the Best Meals Made Just for You!",
      offer: "Savor the flavor of our chef’s special dishes",
      buttonText1: "Order Now",
      buttonText2: "View Menu",
      imgSrc: "/images/DSC_6460.jpg",
    },
    {
      id: 2,
      title: "Enjoy Comfort Food Anytime – Hot & Tasty, Just for You!",
      offer: "Your favorite meals delivered fast",
      buttonText1: "Grab a Bite",
      buttonText2: "See Dishes",
      imgSrc: "/images/DSC_6384.jpg",
    },
    {
      id: 3,
      title: "From Farm to Plate – Fresh Ingredients, Healthy Choices!",
      offer: "Wholesome meals prepared daily",
      buttonText1: "Order Fresh",
      buttonText2: "Explore Menu",
      imgSrc: "/images/DSC_6373.jpg",
    },
    {
      id: 4,
      title: "Celebrate Every Moment with Delicious Treats!",
      offer: "Perfect meals for family and friends",
      buttonText1: "Start Ordering",
      buttonText2: "Browse Menu",
      imgSrc: "/images/DSC_6378.jpg",
    },
    {
      id: 5,
      title: "Good Food, Great Mood – Taste Happiness Today!",
      offer: "Meals that bring people together",
      buttonText1: "Order Now",
      buttonText2: "Discover More",
      imgSrc: "/images/DSC_6284.jpg",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="w-full px-4 sm:px-8 md:px-12 py-4 sm:py-6">
      <div className="overflow-hidden relative w-full">
        {/* Slider track */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sliderData.map((slide, index) => (
            <div
              key={slide.id}
              className="flex flex-col-reverse md:flex-row items-center justify-between bg-green-600 py-6 md:py-10 md:px-14 px-5 mt-6 rounded-xl min-w-full"
            >
              {/* Text Section */}
             <div className="md:w-1/2 md:pl-8 mt-6 md:mt-0 text-center md:text-left">
  <p className="text-sm sm:text-base md:text-[15px] lg:text-[16px] text-gray-200 pb-1">
    {slide.offer}
  </p>
  <h1 className="max-w-lg text-lg sm:text-xl md:text-[26px] lg:text-[32px] leading-snug font-semibold text-white">
    {slide.title}
  </h1>
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-4 md:mt-6">
    <button className="px-6 py-2 sm:px-8 sm:py-2.5 bg-white rounded-full text-green-600 font-medium w-full sm:w-auto">
      {slide.buttonText1}
    </button>
    <button className="group flex items-center justify-center gap-2 px-6 py-2.5 font-medium w-full sm:w-auto text-white">
      {slide.buttonText2}
      <span className="group-hover:translate-x-1 transition">→</span>
    </button>
  </div>
</div>


              {/* Image Section */}
              <div className="flex items-center justify-center w-full md:w-1/2">
  <Image
    className="w-full max-w-[300px] sm:max-w-[360px] md:max-w-[400px] lg:max-w-[480px] xl:max-w-[520px] h-auto object-contain rounded-xl"
    src={slide.imgSrc}
    alt={`Slide ${index + 1}`}
    width={520}
    height={520}
    priority
  />
</div>

            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
          {sliderData.map((_, index) => (
            <div
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`h-2 w-2 rounded-full cursor-pointer ${
                currentSlide === index ? "bg-green-600" : "bg-gray-500/30"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeaderSlider;
