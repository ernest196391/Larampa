import type {Metadata,Viewport} from "next";import "./globals.css";
export const metadata:Metadata={metadataBase:new URL("https://larampa.vercel.app"),title:"La Rampa | Nuestra carta",description:"Descubre la carta de Cafetería La Rampa en Habana Libre.",alternates:{canonical:"/"},openGraph:{title:"La Rampa · Nuestra carta",description:"Sabores para disfrutar sin prisa.",url:"/",images:["/images/hero.webp"]}};
export const viewport:Viewport={themeColor:"#173f33",width:"device-width",initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
