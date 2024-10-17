import type { Metadata } from "next";
import { Poppins, DM_Serif_Display } from "next/font/google";
import "./globals.scss";
import { cn } from "@/lib/utils";
import Provider from "./provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Exploring Indonesia, your way | explorindonesia.com",
  description:
    "Hundreds of Destinations. One simple search. Yearning for your next unforgettable journey? Plan a trip with peace of mind using our services. Set your own itinerary equipped with the advise from our trusted and experienced guides. So you can focus to live out the bucket list dreams of yours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          poppins.className,
          dmSerifDisplay.variable,
          "antialiased"
        )}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
