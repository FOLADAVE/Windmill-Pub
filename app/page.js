"use client";
import { useState } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import ExploreMenu from "./components/Exploremenu";
import TopDishes from "./components/Food";
import HeaderSlider from "./components/Headerslider";
import Navbar from "./components/Navbar";
import EventsSection from "./components/EventsSection";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <main className="bg-white scroll-smooth">
      <Navbar />
      <HeaderSlider />
      <ExploreMenu
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <TopDishes selectedCategory={selectedCategory} />
      <EventsSection />
      <About />
      <Contact />
    </main>
  );
}
