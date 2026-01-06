import type { Metadata } from "next";
import { Fira_Code, Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700", "900"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flux Electrique - Réparation Électronique & Développement Logiciel",
  description:
    "Expert en réparation électronique et développement logiciel. Double expertise Hardware & Software pour vos projets IoT, embarqué et DevSecOps.",
  keywords: [
    "réparation électronique",
    "développement logiciel",
    "DevSecOps",
    "IoT",
    "électronique",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${orbitron.variable} ${firaCode.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
