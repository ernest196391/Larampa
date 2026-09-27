import Link from "next/link";
export default function NotFound(){return <main className="empty" style={{minHeight:"100vh",display:"grid",placeContent:"center"}}><p className="eyebrow">Error 404</p><h1>Parece que esta mesa no existe</h1><p>Regresa a la carta y encuentra algo que te apetezca.</p><Link className="button primary" href="/">Volver a la carta</Link></main>}
