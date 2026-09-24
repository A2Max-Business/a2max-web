import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "A2Max — Performance e Inteligência de Negócios",
  description: "Estratégia, processos, aquisição, tecnologia e dados trabalhando juntos para transformar negócios em operações de alta performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
