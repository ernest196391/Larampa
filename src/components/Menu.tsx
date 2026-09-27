"use client";

import Image from "next/image";
import {useEffect, useMemo, useRef, useState} from "react";
import {categories, featured, MenuItem} from "@/data/menu";
import {ArrowUp, ChevronDown, Grid2X2, Search, X} from "lucide-react";

const featuredImages: Record<string, string> = {
  "Pechuga de pollo a La Rampa": "/images/hero.webp",
  "Sándwich cubano": "/images/sandwich.webp",
  "Pizza de camarón": "/images/pizza.webp",
  "Flan de huevo": "/images/dessert.webp",
};

const quickCategories = [
  {label: "Desayunos", id: "desayunos"}, {label: "Entrepanes", id: "entrepanes"},
  {label: "Pizzas", id: "pizzas"}, {label: "Platos fuertes", id: "principales"},
  {label: "Café y bebidas", id: "cafe"}, {label: "Cócteles y bar", id: "cocteles"},
];

function Price({item}: {item: MenuItem}) {
  return <div className="price" aria-label={`${item.cup.toLocaleString("es-CU")} pesos cubanos, ${item.usd} dólares`}>
    <strong>{item.cup.toLocaleString("es-CU")} <small>CUP</small></strong>
    <span>{item.usd.toLocaleString("es-CU")} <small>USD</small></span>
  </div>;
}

function Logo({white = false, compact = false}: {white?: boolean; compact?: boolean}) {
  const src = white ? "/brand/la-rampa-white.svg" : compact ? "/brand/la-rampa-compact.svg" : "/brand/la-rampa-primary.svg";
  return <Image src={src} alt="La Rampa · Cafetería Coffee Shop" width={compact ? 300 : 520} height={compact ? 120 : 180} priority className="logo"/>;
}

export default function Menu() {
  const [active, setActive] = useState(categories[0].id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, {rootMargin: "-145px 0px -58%", threshold: [0.05, 0.25]});
    categories.forEach(({id}) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const modalOpen = searchOpen || categoriesOpen;
    document.body.classList.toggle("modalOpen", modalOpen);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setSearchOpen(false); setCategoriesOpen(false); } };
    window.addEventListener("keydown", onKey);
    if (searchOpen) window.setTimeout(() => searchRef.current?.focus(), 80);
    return () => { document.body.classList.remove("modalOpen"); window.removeEventListener("keydown", onKey); };
  }, [searchOpen, categoriesOpen]);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    if (!normalized) return [];
    return categories.flatMap((category) => category.items
      .filter((item) => `${item.name} ${item.description ?? ""} ${category.name}`.toLocaleLowerCase("es").includes(normalized))
      .map((item) => ({...item, category: category.name, categoryId: category.id})));
  }, [query]);

  function goToCategory(id: string) {
    setCategoriesOpen(false);
    document.getElementById(id)?.scrollIntoView({behavior: "smooth"});
  }

  return <>
    <a className="skipLink" href="#carta">Saltar a la carta</a>
    <header className="topbar"><a className="brandLogo" href="#inicio" aria-label="Ir al inicio de La Rampa"><Logo compact/></a><button className="iconButton" onClick={() => setSearchOpen(true)} aria-label="Buscar en la carta"><Search size={21}/></button></header>
    <main id="inicio">
      <section className="hero" aria-labelledby="hero-title">
        <Image src="/images/hero.webp" alt="Plato de pollo servido con ensalada y papas en La Rampa" fill priority sizes="100vw"/><div className="heroShade"/>
        <div className="heroCopy"><div className="heroLogo"><Logo white/></div><p className="eyebrow light">Una pausa que sabe a La Habana</p><h1 id="hero-title">Tu pausa en el corazón de La Habana</h1><p className="heroText">Desayunos, café, platos y cócteles para disfrutar sin prisa.</p><div className="heroActions"><a className="button primary" href="#carta">Ver la carta <ChevronDown size={18}/></a><button className="button ghost" onClick={() => setSearchOpen(true)}><Search size={18}/> Buscar un plato</button></div></div>
      </section>
      <div className="mobileTools" aria-label="Herramientas de la carta"><button onClick={() => setCategoriesOpen(true)}><Grid2X2 size={18}/> Categorías</button><button onClick={() => setSearchOpen(true)}><Search size={18}/> Buscar</button></div>
      <section id="carta" className="intro shell"><p className="eyebrow">Nuestra carta</p><h2>Encuentra lo que te apetece en segundos</h2><p>Busca tu plato, revisa el precio y decide sin esperar la carta.</p><div className="quickGrid" aria-label="Categorías principales">{quickCategories.map((category) => <button key={category.label} onClick={() => goToCategory(category.id)}><span>{category.label}</span><small>Ver opciones</small></button>)}</div><button className="allCategories" onClick={() => setCategoriesOpen(true)}><Grid2X2 size={18}/> Ver las 11 categorías</button></section>
      <section className="featured shell" aria-labelledby="featured-title"><div className="sectionHead"><p className="eyebrow">Favoritos de La Rampa</p><h2 id="featured-title">Los favoritos que nunca fallan</h2></div><div className="featuredGrid">{featured.map((item) => <article key={item.name} className="featureCard"><Image src={featuredImages[item.name] ?? "/images/hero.webp"} alt={item.name} fill sizes="(max-width: 700px) 78vw, 25vw"/><div className="featureShade"/><div className="featureContent"><span>{item.badge ?? "Recomendado"}</span><h3>{item.name}</h3><Price item={item}/></div></article>)}</div></section>
      <div className="menuSections shell">{categories.map((category) => <section id={category.id} className="menuSection" key={category.id}>{category.image ? <div className="categoryImage"><Image src={category.image} alt={`Selección de ${category.name}`} fill sizes="(max-width: 800px) 100vw, 45vw"/></div> : null}<div className="categoryContent"><div className="sectionHead"><p className="eyebrow">{category.eyebrow}</p><h2>{category.name}</h2><span>{category.items.length} opciones</span></div><div className="items">{category.items.map((item) => { const key = `${category.id}-${item.name}-${item.portion ?? ""}`; const hasDetails = Boolean(item.description || item.portion); return <article className="item" key={key}><button className="itemMain" onClick={() => hasDetails && setExpanded(expanded === key ? null : key)} aria-expanded={hasDetails ? expanded === key : undefined}><span className="itemCopy"><span className="itemTitle"><strong>{item.name}</strong>{item.badge ? <em>{item.badge}</em> : null}</span>{item.portion ? <small>{item.portion}</small> : null}{item.description ? <span className={expanded === key ? "description open" : "description"}>{item.description}</span> : null}</span><Price item={item}/></button></article>; })}</div></div></section>)}</div>
      <section className="visit"><div><p className="eyebrow light">Cafetería · Coffee Shop</p><h2>Una buena mesa. Tiempo para disfrutar.</h2><p>Visítanos en el entorno del Habana Libre, La Habana. Productos sujetos a disponibilidad.</p></div><div className="qrCard"><Image src="/qr-la-rampa.png" alt="Código QR de la carta digital de La Rampa" width={150} height={150}/><p><strong>Lleva la carta contigo</strong><span>Escanea y consulta desde tu teléfono.</span></p></div></section>
    </main>
    <footer><Logo white/><p>Habana Libre · La Habana</p><p className="fine">Carta digital · Precios sujetos a disponibilidad.</p><a href="/admin">Vista administrativa</a></footer><button className="toTop" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})} aria-label="Volver arriba"><ArrowUp size={19}/></button>
    {categoriesOpen ? <div className="modalBackdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setCategoriesOpen(false)}><section className="sheet" role="dialog" aria-modal="true" aria-labelledby="categories-title"><div className="modalHead"><div><p className="eyebrow">Explora la carta</p><h2 id="categories-title">Todas las categorías</h2></div><button className="closeButton" onClick={() => setCategoriesOpen(false)} aria-label="Cerrar categorías"><X/></button></div><div className="categoryList">{categories.map((category, index) => <button key={category.id} onClick={() => goToCategory(category.id)} className={active === category.id ? "active" : ""}><span>{String(index + 1).padStart(2, "0")}</span><strong>{category.name}</strong><small>{category.items.length}</small></button>)}</div></section></div> : null}
    {searchOpen ? <div className="modalBackdrop searchBackdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSearchOpen(false)}><section className="searchPanel" role="dialog" aria-modal="true" aria-labelledby="search-title"><div className="modalHead"><div><p className="eyebrow">Encuentra en segundos</p><h2 id="search-title">¿Qué te apetece?</h2></div><button className="closeButton" onClick={() => setSearchOpen(false)} aria-label="Cerrar búsqueda"><X/></button></div><label className="searchField"><Search size={20}/><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pizza, café, pollo, mojito…" aria-label="Buscar productos"/>{query ? <button onClick={() => setQuery("")} aria-label="Limpiar búsqueda"><X size={18}/></button> : null}</label><div className="searchResults" aria-live="polite">{!query.trim() ? <div className="searchPrompt"><p>Prueba buscando:</p><div>{["Pizza", "Café", "Pollo", "Mojito", "Camarón"].map((term) => <button key={term} onClick={() => setQuery(term)}>{term}</button>)}</div></div> : null}{query.trim() && results.length === 0 ? <div className="empty"><h3>No encontramos “{query}”</h3><p>Prueba con otro nombre o explora las categorías.</p></div> : null}{results.map((item) => <button className="result" key={`${item.categoryId}-${item.name}-${item.portion ?? ""}`} onClick={() => {setSearchOpen(false); goToCategory(item.categoryId);}}><span><small>{item.category}</small><strong>{item.name}</strong>{item.portion ? <em>{item.portion}</em> : null}</span><Price item={item}/></button>)}</div></section></div> : null}
  </>;
}
