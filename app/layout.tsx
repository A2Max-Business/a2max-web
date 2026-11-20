import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { getSiteOrigin, DEFAULT_OG_IMAGE, getRobotsMetadata } from "@/lib/organic";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const origin = getSiteOrigin();

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: "A2Max — Performance e Inteligência de Negócios",
    template: "%s | A2Max",
  },
  description:
    "Estratégia, processos, aquisição, tecnologia e dados trabalhando juntos para transformar negócios em operações de alta performance.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "A2Max — Performance e Inteligência de Negócios",
    title: "A2Max — Performance e Inteligência de Negócios",
    description:
      "Estratégia, processos, aquisição, tecnologia e dados trabalhando juntos para transformar negócios em operações de alta performance.",
    url: origin,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "A2Max — Performance e Inteligência de Negócios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "A2Max — Performance e Inteligência de Negócios",
    description:
      "Estratégia, processos, aquisição, tecnologia e dados trabalhando juntos para transformar negócios em operações de alta performance.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: getRobotsMetadata(),
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
