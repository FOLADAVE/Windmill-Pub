import React from "react";
import Image from "next/image";
import Link from "next/link";

const Contact = () => {
    const currentYear = new Date().getFullYear();
  return (
    <section id="Contact">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-6 md:px-16 lg:px-32 py-14 border-b border-gray-500/30 text-gray-500">
        
        {/* Left side - Logo and description */}
        <div className="md:col-span-2">
          <Image
            className="w-28 md:w-32"
            src="/images/windmill.png"
            alt="logo"
            width={140}
            height={140}
          />
          <p className="mt-6 text-sm leading-relaxed">
            Feel free to get in touch with us. We are always open to discussing
            new projects, creative ideas, or opportunities to be part of your
            vision.
          </p>
        </div>

        {/* Middle - Quick links */}
        <div>
          <h2 className="font-medium text-green-600 mb-5">Company</h2>
          <ul className="space-y-4 text-sm cursor-pointer">
            <li>
              <Link href="/#Home" className="block w-full">Home</Link>
            </li>
            <li>
              <Link href="/#Menu" className="block w-full">Menu</Link>
            </li>
            <li>
              <Link href="/#About" className="block w-full">About</Link>
            </li>
            <li>
              <Link href="/#Contact" className="block w-full">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Right side - Contact details */}
        <div>
          <h2 className="font-medium text-green-600 mb-5">Get in touch</h2>
          <div className="text-sm space-y-2">
            <p>+1-234-567-890</p>
            <p>Events@thewindmillpub.co.uk</p>
            <p>50 High St, London, England W3 6</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright {currentYear} © The Windmill Pub Hitchin. All Rights Reserved.
      </p>
    </section>
  );
};

export default Contact;
