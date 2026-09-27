import type {Metadata, Viewport} from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://larampa.vercel.app"),
  title: {default: "La Rampa | Carta digital", template: "%s · La Rampa"},
  description: "Consulta desayunos, café, platos, pizzas, postres y cócteles de Cafetería La Rampa en La Habana.",
  applicationName: "La Rampa", alternates: {canonical: "/"}, icons: {icon: "/icon.svg"},
  openGraph: {type: "website", locale: "es_CU", title: "La Rampa · Carta digital", description: "Desayunos, platos, café y cócteles en el entorno del Habana Libre.", url: "/", siteName: "La Rampa", images: [{url: "/images/hero.webp", width: 1536, height: 1024, alt: "Carta digital de La Rampa"}]},
  twitter: {card: "summary_large_image", title: "La Rampa · Carta digital", description: "Explora la carta y conoce el precio antes de pedir.", images: ["/images/hero.webp"]},
};
export const viewport: Viewport = {themeColor: "#173f33", width: "device-width", initialScale: 1};
const structuredData = {"@context": "https://schema.org", "@type": "CafeOrCoffeeShop", name: "La Rampa", url: "https://larampa.vercel.app/", image: "https://larampa.vercel.app/images/hero.webp", servesCuisine: ["Cubana", "Cafetería"], address: {"@type": "PostalAddress", addressLocality: "La Habana", addressCountry: "CU"}, priceRange: "CUP · USD"};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="es"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData).replace(/</g, "\\u003c")}}/></body></html>; }
