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

function ProductRow({item, categoryId, expanded, onToggle}: {item: MenuItem; categoryId: string; expanded: string | null; onToggle: (key: string) => void}) {
  const key = `${categoryId}-${item.name}-${item.portion ?? ""}`;
  const hasDetails = Boolean(item.description || item.portion);
  const content = <><span className="itemCopy"><span className="itemTitle"><strong>{item.name}</strong>{item.badge ? <em>{item.badge}</em> : null}</span>{item.portion ? <small>{item.portion}</small> : null}{item.description ? <span className={expanded === key ? "description open" : "description"}>{item.description}</span> : null}</span><Price item={item}/></>;
  return <article className="item">{hasDetails ? <button className="itemMain" onClick={() => onToggle(key)} aria-expanded={expanded === key}>{content}</button> : <div className="itemMain itemStatic">{content}</div>}</article>;
}

function Logo({white = false, compact = false}: {white?: boolean; compact?: boolean}) {
  const src = compact
    ? white ? "/brand/la-rampa-compact-white.svg" : "/brand/la-rampa-compact.svg"
    : white ? "/brand/la-rampa-white.svg" : "/brand/la-rampa-primary.svg";
  return <Image src={src} alt="La Rampa · Cafetería Coffee Shop" width={compact ? 740 : 760} height={compact ? 320 : 438} priority className="logo"/>;
}

export default function Menu() {
  const [active, setActive] = useState(categories[0].id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showTools, setShowTools] = useState(false);
  const [showToTop, setShowToTop] = useState(false);
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

  useEffect(() => {
    const updateScrollUI = () => {
      const hero = document.querySelector<HTMLElement>(".hero");
      const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - 90 : 420;
      setShowTools(window.scrollY > heroEnd);
      setShowToTop(window.scrollY > 900);
    };
    updateScrollUI();
    window.addEventListener("scroll", updateScrollUI, {passive: true});
    window.addEventListener("resize", updateScrollUI);
    return () => { window.removeEventListener("scroll", updateScrollUI); window.removeEventListener("resize", updateScrollUI); };
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    if (!normalized) return [];
    return categories.flatMap((category) => category.items
      .filter((item) => `${item.name} ${item.description ?? ""} ${category.name}`.toLocaleLowerCase("es").includes(normalized))
      .map((item) => ({...item, category: category.name, categoryId: category.id})));
  }, [query]);

  function goToCategory(id: string) {
    setCategoriesOpen(false);
    setSearchOpen(false);

    // Wait for any open sheet/modal to unmount before calculating the target position.
    // Using window.scrollTo is more reliable than scrollIntoView on older Android/Xiaomi browsers.
    window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;
      const header = document.querySelector<HTMLElement>(".topbar");
      const offset = (header?.offsetHeight ?? 76) + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({top: Math.max(0, top), behavior: "smooth"});
      window.history.replaceState(null, "", `#${id}`);
      setActive(id);
    }, 60);
  }

  return <>
    <a className="skipLink" href="#carta">Saltar a la carta</a>
    <header className="topbar"><a className="brandLogo" href="#inicio" aria-label="Ir al inicio de La Rampa"><Logo compact/></a><button className="iconButton" onClick={() => setSearchOpen(true)} aria-label="Buscar en la carta"><Search size={21}/></button></header>
    <main id="inicio">
      <section className="hero" aria-labelledby="hero-title">
        <Image src="/images/hero.webp" alt="Plato de pollo servido con ensalada y papas en La Rampa" fill priority sizes="100vw"/><div className="heroShade"/>
        <div className="heroCopy"><h1 id="hero-title">¿Qué vas a pedir hoy?</h1><p className="heroText">Platos, café y cócteles con precios claros en CUP y USD.</p><div className="heroActions"><a className="button primary" href="#carta">Ver la carta <ChevronDown size={18}/></a></div></div>
      </section>
      <div className={showTools ? "mobileTools visible" : "mobileTools"} aria-label="Herramientas de la carta" aria-hidden={!showTools}><button onClick={() => setCategoriesOpen(true)} tabIndex={showTools ? 0 : -1}><Grid2X2 size={18}/> Categorías</button><button onClick={() => setSearchOpen(true)} tabIndex={showTools ? 0 : -1}><Search size={18}/> Buscar</button></div>
      <section id="carta" className="intro shell"><p className="eyebrow">Encuentra lo tuyo</p><h2>Empieza por aquí</h2><div className="quickGrid" aria-label="Categorías principales">{quickCategories.map((category) => <button key={category.label} onClick={() => goToCategory(category.id)}><span>{category.label}</span></button>)}</div><button className="allCategories" onClick={() => setCategoriesOpen(true)}><Grid2X2 size={18}/> Ver toda la carta</button></section>
      <section className="featured shell" aria-labelledby="featured-title"><div className="sectionHead"><p className="eyebrow">Una elección rápida</p><h2 id="featured-title">Los más buscados</h2></div><div className="featuredGrid">{featured.map((item) => <article key={item.name} className="featureCard"><div className="featureMedia"><Image src={featuredImages[item.name] ?? "/images/hero.webp"} alt={item.name} fill sizes="(max-width: 680px) 46vw, (max-width: 900px) 50vw, 25vw"/></div><div className="featureContent"><span>{item.badge ?? "Recomendado"}</span><h3>{item.name}</h3><Price item={item}/></div></article>)}</div></section>
      <div className="menuSections shell">{categories.map((category) => <section id={category.id} className="menuSection" key={category.id}>{category.image ? <div className="categoryImage"><Image src={category.image} alt={`Selección de ${category.name}`} fill sizes="(max-width: 800px) 100vw, 45vw"/></div> : null}<div className="categoryContent"><div className="sectionHead"><p className="eyebrow">{category.eyebrow}</p><h2>{category.name}</h2><span>{category.items.length} opciones</span></div><div className="items">{category.items.map((item) => <ProductRow key={`${category.id}-${item.name}-${item.portion ?? ""}`} item={item} categoryId={category.id} expanded={expanded} onToggle={(key) => setExpanded(expanded === key ? null : key)}/>)}</div></div></section>)}</div>
      <section className="visit"><div><p className="eyebrow light">La Rampa · La Habana</p><h2>De la primera taza al último cóctel.</h2><p>Estamos en el entorno del Habana Libre. La disponibilidad de algunos productos puede variar.</p></div><div className="qrCard"><Image src="/qr-la-rampa.png" alt="Código QR de la carta digital de La Rampa" width={150} height={150}/><p><strong>La carta en tu móvil</strong><span>Escanea para volver cuando quieras.</span></p></div></section>
    </main>
    <footer><Logo white/><p>Habana Libre · La Habana</p><p className="fine">Carta digital · Precios sujetos a disponibilidad.</p><a href="/admin">Vista administrativa</a></footer>{showToTop ? <button className="toTop" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})} aria-label="Volver arriba"><ArrowUp size={19}/></button> : null}
    {categoriesOpen ? <div className="modalBackdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setCategoriesOpen(false)}><section className="sheet" role="dialog" aria-modal="true" aria-labelledby="categories-title"><div className="modalHead"><div><p className="eyebrow">Explora la carta</p><h2 id="categories-title">Todas las categorías</h2></div><button className="closeButton" onClick={() => setCategoriesOpen(false)} aria-label="Cerrar categorías"><X/></button></div><div className="categoryList">{categories.map((category, index) => <button key={category.id} onClick={() => goToCategory(category.id)} className={active === category.id ? "active" : ""}><span>{String(index + 1).padStart(2, "0")}</span><strong>{category.name}</strong><small>{category.items.length}</small></button>)}</div></section></div> : null}
    {searchOpen ? <div className="modalBackdrop searchBackdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSearchOpen(false)}><section className="searchPanel" role="dialog" aria-modal="true" aria-labelledby="search-title"><div className="modalHead"><div><p className="eyebrow">Platos, bebidas y categorías</p><h2 id="search-title">Busca en la carta</h2></div><button className="closeButton" onClick={() => setSearchOpen(false)} aria-label="Cerrar búsqueda"><X/></button></div><label className="searchField"><Search size={20}/><input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pizza, café, pollo, mojito…" aria-label="Buscar productos"/>{query ? <button onClick={() => setQuery("")} aria-label="Limpiar búsqueda"><X size={18}/></button> : null}</label><div className="searchResults" aria-live="polite">{!query.trim() ? <div className="searchPrompt"><p>Prueba buscando:</p><div>{["Pizza", "Café", "Pollo", "Mojito", "Camarón"].map((term) => <button key={term} onClick={() => setQuery(term)}>{term}</button>)}</div></div> : null}{query.trim() && results.length === 0 ? <div className="empty"><h3>No encontramos “{query}”</h3><p>Prueba con otro nombre o explora las categorías.</p></div> : null}{results.map((item) => <button className="result" key={`${item.categoryId}-${item.name}-${item.portion ?? ""}`} onClick={() => {setSearchOpen(false); goToCategory(item.categoryId);}}><span><small>{item.category}</small><strong>{item.name}</strong>{item.portion ? <em>{item.portion}</em> : null}</span><Price item={item}/></button>)}</div></section></div> : null}
  </>;
}
