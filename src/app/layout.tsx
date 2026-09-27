import type {Metadata,Viewport} from "next";import "./globals.css";
export const metadata:Metadata={title:"La Rampa | Nuestra carta",description:"Descubre la carta de Cafetería La Rampa en Habana Libre.",openGraph:{title:"La Rampa · Nuestra carta",description:"Sabores para disfrutar sin prisa.",images:["/images/hero.webp"]}};
export const viewport:Viewport={themeColor:"#173f33",width:"device-width",initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
