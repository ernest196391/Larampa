"use client";
import Image from "next/image";
import {useEffect,useMemo,useState} from "react";
import {categories,featured,MenuItem} from "@/data/menu";
import {ChevronDown,Search,X} from "lucide-react";

const imageFor=(item:MenuItem)=> item.name.includes("Sándwich")?"/images/sandwich.webp":item.name.includes("Pizza")?"/images/pizza.webp":item.name.includes("Flan")?"/images/dessert.webp":"/images/hero.webp";
const Price=({item}:{item:MenuItem})=><div className="price"><strong>{item.cup.toLocaleString("es-CU")} <small>CUP</small></strong><span>{item.usd.toFixed(2)} <small>USD</small></span></div>;

export default function Menu(){
 const [query,setQuery]=useState(""); const [active,setActive]=useState(categories[0].id); const [expanded,setExpanded]=useState<string|null>(null);
 useEffect(()=>{const obs=new IntersectionObserver(es=>{const e=es.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(e)setActive(e.target.id)}, {rootMargin:"-160px 0px -55%",threshold:[.05,.3]});categories.forEach(c=>{const el=document.getElementById(c.id);if(el)obs.observe(el)});return()=>obs.disconnect()},[]);
 const filtered=useMemo(()=>query?categories.map(c=>({...c,items:c.items.filter(i=>(i.name+" "+(i.description||"")).toLowerCase().includes(query.toLowerCase()))})).filter(c=>c.items.length):categories,[query]);
 return <>
 <header className="topbar"><a className="brand" href="#inicio"><span>CAFETERÍA · COFFEE SHOP</span><b>La Rampa</b></a><button className="searchBtn" onClick={()=>document.getElementById("search")?.focus()} aria-label="Buscar en la carta"><Search size={20}/></button></header>
 <main id="inicio">
  <section className="hero"><Image src="/images/hero.webp" alt="Plato servido en el ambiente de La Rampa" fill priority sizes="100vw"/><div className="heroShade"/><div className="heroCopy"><p>Cafetería · Coffee shop</p><h1>¿Qué te apetece hoy?</h1><a href="#carta">Descubre nuestra carta <ChevronDown size={18}/></a></div></section>
  <div id="carta" className="navWrap"><nav aria-label="Categorías">{categories.map(c=><a key={c.id} href={`#${c.id}`} className={active===c.id?"active":""} aria-current={active===c.id?"true":undefined}>{c.name}</a>)}</nav></div>
  <section className="intro"><p className="kicker">Nuestra carta</p><h2>Sabores para disfrutar sin prisa</h2><p>Explora la selección de La Rampa. Los precios en CUP y USD se muestran de forma independiente.</p><label className="search"><Search size={19}/><input id="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar café, pizza, mojito…" aria-label="Buscar productos"/>{query&&<button onClick={()=>setQuery("")} aria-label="Limpiar búsqueda"><X size={18}/></button>}</label></section>
  {!query&&<section className="featured"><div className="sectionHead"><p className="kicker">Favoritos de La Rampa</p><h2>Una buena elección</h2></div><div className="featuredGrid">{featured.map((i,idx)=><article key={i.name} className="featureCard"><Image src={imageFor(i)} alt={i.name} fill sizes="(max-width: 700px) 74vw, 25vw"/><div className="featureShade"/><div><span>{i.badge||"Recomendado"}</span><h3>{i.name}</h3><Price item={i}/></div></article>)}</div></section>}
  <div className="menuSections">{filtered.map(c=><section id={c.id} className="menuSection" key={c.id}>{c.image&&<div className="categoryImage"><Image src={c.image} alt={`Selección de ${c.name}`} fill sizes="(max-width: 800px) 100vw, 50vw"/></div>}<div className="sectionHead"><p className="kicker">{c.eyebrow}</p><h2>{c.name}</h2></div><div className="items">{c.items.map(i=><article className="item" key={i.name+i.portion} onClick={()=>setExpanded(expanded===i.name?null:i.name)}><div className="itemCopy"><div className="itemTitle"><h3>{i.name}</h3>{i.badge&&<span>{i.badge}</span>}</div>{i.portion&&<p className="portion">{i.portion}</p>}{i.description&&<p className={expanded===i.name?"desc open":"desc"}>{i.description}</p>}</div><Price item={i}/></article>)}</div></section>)}</div>
  {query&&filtered.length===0&&<div className="empty"><h2>No encontramos “{query}”</h2><p>Prueba con otro nombre o explora las categorías.</p></div>}
 </main>
 <footer><div className="footerBrand"><span>CAFETERÍA · COFFEE SHOP</span><b>La Rampa</b></div><p>Habana Libre · La Habana</p><p className="fine">Carta digital · Precios sujetos a disponibilidad.</p><a href="/admin">Administrar carta</a></footer>
 </>;
}
