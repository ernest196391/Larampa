import Image from "next/image";

export default function QRPage(){
  return <main className="standaloneQrPage">
    <section className="standaloneQrCard">
      <div className="standaloneQrMark"><span>CAFETERÍA · COFFEE SHOP</span><b>La Rampa</b></div>
      <p className="eyebrow">Nuestra carta digital</p>
      <h1>¿Qué te apetece hoy?</h1>
      <div className="standaloneQrBox"><Image src="/qr-la-rampa.png" width={1200} height={1200} alt="Código QR para abrir la carta digital de La Rampa" priority/></div>
      <p className="standaloneQrCta">Escanea y descubre nuestra carta</p>
      <small>Apunta la cámara de tu teléfono hacia el código</small>
    </section>
  </main>
}
