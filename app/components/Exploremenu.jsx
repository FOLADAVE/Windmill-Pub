"use client";
import Image from "next/image";

const menuItems = [
  { name: "Salad", img: "/images/salad.png" },
  { name: "Burger", img: "/images/burgerr.png" },
  { name: "Chef's Special", img: "/images/chefs-special.png" },
  { name: "Munchies", img: "/images/munchiez.jpg" },
  { name: "Sea Delights", img: "/images/salmon.png" },
  { name: "Sizzlers", img: "/images/chicken.png" },
  { name: "Sweet Treats", img: "/images/sweet.png" },
  { name: "Pizza", img: "/images/pizza.png" },
];

export default function MenuSection({ setSelectedCategory, selectedCategory }) {
  return (
    <section className="py-12 text-center" id="Menu">
      <h2 className="text-3xl font-bold mb-4 text-green-600">Explore our menu</h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-10">
        Experience culinary bliss at our restaurant, where our diverse menu
        offers a symphony of flavors passionately crafted with the finest
        ingredients.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-6 justify-items-center">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(item.name)}
            className={`flex flex-col items-center cursor-pointer ${
              selectedCategory === item.name ? "scale-105 text-green-600" : ""
            }`}
          >
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-md hover:scale-105 transition-transform duration-300">
              <Image
                src={item.img}
                alt={item.name}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="mt-2 text-gray-700 font-medium">{item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
