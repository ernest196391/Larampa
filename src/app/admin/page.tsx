import Image from "next/image";
import Link from "next/link";
import {categories, featured} from "@/data/menu";

export const metadata = {title: "Vista administrativa | La Rampa", robots: {index: false, follow: false}};

export default function AdminPage() {
  const productCount = categories.reduce((total, category) => total + category.items.length, 0);
  return <main className="adminDemo">
    <div className="adminBanner"><strong>Modo demostración</strong><span>Esta vista no guarda cambios todavía. La estructura está preparada para conectarse a un proyecto Supabase dedicado.</span></div>
    <div className="adminShell">
      <aside className="adminSide"><Image src="/brand/la-rampa-white.svg" alt="La Rampa" width={520} height={180} className="logo"/><nav aria-label="Secciones administrativas"><button className="active">Resumen</button><button>Productos</button><button>Categorías</button><button>Destacados</button><button>Fotografías</button><button>Configuración</button></nav></aside>
      <section className="adminMain">
        <header className="adminTop"><div><p className="eyebrow">Centro de control</p><h1>Resumen de la carta</h1></div><Link href="/">Ver carta pública</Link></header>
        <div className="stats"><div className="stat"><strong>{categories.length}</strong><span>Categorías</span></div><div className="stat"><strong>{productCount}</strong><span>Productos</span></div><div className="stat"><strong>{featured.length}</strong><span>Destacados</span></div></div>
        <p className="adminNote">Los controles aparecen desactivados para evitar simular un guardado inexistente. Al conectar Supabase, esta misma interfaz gestionará precios CUP/USD, disponibilidad y contenido.</p>
        {categories.map((category) => <details key={category.id} open={category.id === "desayunos"}><summary><span>{category.name}</span><small>{category.items.length} productos</small></summary><div className="adminRows">{category.items.map((item) => <div className="adminRow" key={`${item.name}-${item.portion ?? ""}`}><div><strong>{item.name}</strong><small>{item.portion ?? "Sin porción indicada"}</small></div><label>CUP<input value={item.cup} readOnly aria-label={`Precio CUP de ${item.name}`}/></label><label>USD<input value={item.usd} readOnly aria-label={`Precio USD de ${item.name}`}/></label><span className="statusPill">Disponible</span></div>)}</div></details>)}
      </section>
    </div>
  </main>;
}
