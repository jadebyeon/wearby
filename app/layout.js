import { Nunito, Inter, Caveat } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-nunito",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
});
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-caveat",
});

export const metadata = {
  title: "Wearby",
  description: "A dress-up sticker diary.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${inter.variable} ${caveat.variable}`}
    >
      <body>
        <div className="app">{children}</div>
      </body>
    </html>
  );
}