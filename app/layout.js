import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aplicație Matematică",
  description: "Teste grilă pentru gimnaziu",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
