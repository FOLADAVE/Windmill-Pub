import { Lato, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // import our client wrapper

// Import Lato (main body font)
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

// Import Outfit (headings font)
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "The Windmill Pub Restaurant",
  description:
    "The Windmill Pub Restaurant in Actonne, London, offers a quintessential pub dining experience with a diverse menu that spans traditional British and Irish dishes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" style={{ scrollBehavior: "smooth" }}>
      <head>
        <link
          rel="icon"
          href="/images/windmill-hitchin.png"
          type="image/png"
          sizes="32x32"
        />
      </head>
      <body className={`${lato.variable} ${outfit.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
