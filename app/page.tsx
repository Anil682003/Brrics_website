"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface ServiceItem { num: string; title: string; desc: string; tags: string[]; }
interface ProjectItem { title: string; desc: string; cat: string; metricVal: string; metricLbl: string; techs: string[]; gradient: string; shapeColor: string; shapes: "rounded"|"circles"|"diamonds"; }
interface StatItem { val: number; suffix: string; lbl: string; }

const ArrowRight = () => (<svg className="arrow-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>);
const ArrowUpRight = () => (<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"/></svg>);

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } }), { threshold: 0.07 });
    el.querySelectorAll(".reveal").forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) => setPos({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;
}

function useTextScramble(text: string, trigger: boolean, speed = 28) {
  const [displayed, setDisplayed] = useState("");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*01";
  useEffect(() => {
    if (!trigger) return;
    let frame = 0; const total = text.length * 2.2;
    const iv = setInterval(() => {
      const progress = frame / total; const resolved = Math.floor(progress * text.length);
      let r = "";
      for (let i = 0; i < text.length; i++) { if (text[i] === " ") r += " "; else if (i < resolved) r += text[i]; else if (i < resolved + 3) r += chars[Math.floor(Math.random() * chars.length)]; else r += " "; }
      setDisplayed(r); frame++;
      if (frame > total) { setDisplayed(text); clearInterval(iv); }
    }, speed);
    return () => clearInterval(iv);
  }, [trigger, text, speed]);
  return displayed;
}

function useCounter(target: number, trigger: boolean, duration = 2200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const step = (now: number) => { const p = Math.min((now - start) / duration, 1); setCount(Math.floor((1 - Math.pow(1 - p, 4)) * target)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);
  return count;
}

function StatCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, inView } = useInView(0.3);
  const count = useCounter(target, inView);
  return (<div ref={ref} className="stat-item"><span className="stat-val">{count}{suffix}</span><span className="stat-lbl">{label}</span><span className="stat-dot">•</span></div>);
}

function MagneticWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.25}px, ${(e.clientY - rect.top - rect.height / 2) * 0.25}px)`;
  }, []);
  const handleLeave = useCallback(() => { if (ref.current) ref.current.style.transform = "translate(0,0)"; }, []);
  return (<div ref={ref} className={`magnetic ${className}`} onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)", display: "inline-block" }}>{children}</div>);
}

function ProjectShapes({ color, type }: { color: string; type: string }) {
  if (type === "circles") return (<div className="shapes"><div className="shape-box"><div className="shape-spin" style={{ position:"absolute", inset:0, border:`1px solid rgba(${color},0.12)`, borderRadius:"50%" }}/><div className="shape-spin-rev" style={{ position:"absolute", inset:48, border:`1px solid rgba(${color},0.08)`, borderRadius:"50%" }}/><div className="shape-spin" style={{ position:"absolute", inset:96, border:`1px solid rgba(${color},0.08)`, borderRadius:"50%" }}/><div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:16, height:16, background:`rgba(${color},0.35)`, borderRadius:"50%", boxShadow:`0 0 40px rgba(${color},0.25)` }}/><div className="shape-float" style={{ position:"absolute", top:16, left:"50%", width:6, height:6, background:`rgba(${color},0.25)`, borderRadius:"50%" }}/><div className="shape-float-delay" style={{ position:"absolute", bottom:32, right:48, width:6, height:6, background:`rgba(${color},0.25)`, borderRadius:"50%" }}/></div></div>);
  if (type === "diamonds") return (<div className="shapes"><div className="shape-box"><div className="shape-spin" style={{ position:"absolute", inset:16, border:`1px solid rgba(${color},0.12)`, transform:"rotate(45deg)" }}/><div className="shape-spin-rev" style={{ position:"absolute", inset:48, border:`1px solid rgba(${color},0.08)`, transform:"rotate(12deg)" }}/><div style={{ position:"absolute", inset:80, background:`rgba(${color},0.04)`, borderRadius:4, transform:"rotate(-12deg)" }}/><div className="shape-float" style={{ position:"absolute", top:32, right:32, width:10, height:10, background:`rgba(${color},0.2)`, borderRadius:"50%", boxShadow:`0 0 20px rgba(${color},0.15)` }}/><div className="shape-float-delay" style={{ position:"absolute", bottom:48, left:48, width:6, height:6, background:`rgba(${color},0.3)`, borderRadius:"50%" }}/></div></div>);
  return (<div className="shapes"><div className="shape-box"><div className="shape-spin" style={{ position:"absolute", inset:32, border:`1px solid rgba(${color},0.15)`, borderRadius:16, transform:"rotate(12deg)" }}/><div className="shape-spin-rev" style={{ position:"absolute", inset:64, border:`1px solid rgba(${color},0.1)`, borderRadius:12, transform:"rotate(-6deg)" }}/><div style={{ position:"absolute", inset:96, background:`rgba(${color},0.04)`, borderRadius:8 }}/><div className="shape-breathe" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:80, height:80, background:`rgba(${color},0.08)`, borderRadius:"50%", filter:"blur(20px)" }}/></div></div>);
}

const services: ServiceItem[] = [
  { num: "01", title: "Digital Strategy", desc: "Data-driven roadmaps that align technology with business goals. We decode market complexity into actionable digital blueprints.", tags: ["Research", "Analytics", "Roadmapping"] },
  { num: "02", title: "Design & Branding", desc: "Visual identities that cut through noise. From brand systems to immersive interfaces, every pixel serves a purpose.", tags: ["UI/UX", "Brand Identity", "Motion Design"] },
  { num: "03", title: "Development", desc: "Engineered for scale. We build performant, resilient applications using modern stacks and battle-tested architecture.", tags: ["Web Apps", "Mobile", "Cloud Infrastructure"] },
  { num: "04", title: "Growth & Launch", desc: "From MVP to market dominance. We orchestrate launches, optimize funnels, and accelerate traction with precision.", tags: ["SEO", "Performance", "Launch Strategy"] },
];

const projects: ProjectItem[] = [
  { title: "Neural Commerce Platform", desc: "A next-gen e-commerce ecosystem powered by real-time AI personalization. Predictive inventory, dynamic pricing, and a conversational shopping interface that boosted conversion by 340%.", cat: "E-Commerce · AI Integration", metricVal: "340%", metricLbl: "Conversion Uplift", techs: ["Next.js", "Python", "TensorFlow", "AWS"], gradient: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01), transparent)", shapeColor: "255,255,255", shapes: "rounded" },
  { title: "Orbital — Fintech Dashboard", desc: "Real-time financial analytics platform processing 2M+ transactions daily. Interactive 3D data visualizations, custom charting engine, and sub-100ms query response times.", cat: "Finance · Data Visualization", metricVal: "2M+", metricLbl: "Daily Transactions", techs: ["React", "Go", "PostgreSQL", "WebGL"], gradient: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(200,200,200,0.02), transparent)", shapeColor: "200,200,200", shapes: "circles" },
  { title: "Meridian Health System", desc: "Connected health monitoring platform integrating 50K+ IoT devices. HIPAA-compliant infrastructure with real-time patient data streams and predictive alert systems.", cat: "Healthcare · IoT Platform", metricVal: "50K+", metricLbl: "Connected Devices", techs: ["TypeScript", "Rust", "MQTT", "GCP"], gradient: "linear-gradient(135deg, rgba(255,255,255,0.035), rgba(220,220,220,0.015), transparent)", shapeColor: "220,220,220", shapes: "diamonds" },
];

const statsData: StatItem[] = [
  { val: 50, suffix: "+", lbl: "Projects Delivered" }, { val: 98, suffix: "%", lbl: "Client Satisfaction" },
  { val: 15, suffix: "+", lbl: "Industries Served" }, { val: 49, suffix: "", lbl: "Average Rating" },
  { val: 30, suffix: "+", lbl: "Team Members" }, { val: 12, suffix: "+", lbl: "Countries Reached" },
];

export default function BrricsPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);
  const pageRef = useScrollReveal();
  const mouse = useMouseParallax();
  const heroRef = useInView(0.1);
  const heroLine1 = useTextScramble("We Build", heroRef.inView && loaded, 32);
  const heroLine2 = useTextScramble("Digital Futures", heroRef.inView && loaded, 26);

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 600); return () => clearTimeout(t); }, []);
  useEffect(() => { const h = () => setNavScrolled(window.scrollY > 60); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move, { passive: true });
    const addH = () => setCursorHover(true); const remH = () => setCursorHover(false);
    const els = document.querySelectorAll("a, button, .project-card, .service-card, .magnetic");
    els.forEach((el) => { el.addEventListener("mouseenter", addH); el.addEventListener("mouseleave", remH); });
    return () => { window.removeEventListener("mousemove", move); els.forEach((el) => { el.removeEventListener("mouseenter", addH); el.removeEventListener("mouseleave", remH); }); };
  }, [loaded]);

  useEffect(() => {
    const cards = document.querySelectorAll(".project-card");
    const handlers: { card: Element; enter: () => void; leave: () => void }[] = [];
    cards.forEach((card) => {
      const shapes = card.querySelectorAll(".shape-box > div") as NodeListOf<HTMLElement>;
      const enter = () => shapes.forEach((s) => { s.style.transform = `rotate(${(Math.random()-0.5)*30}deg) scale(${0.9+Math.random()*0.2})`; });
      const leave = () => shapes.forEach((s) => { s.style.transform = ""; });
      card.addEventListener("mouseenter", enter); card.addEventListener("mouseleave", leave);
      handlers.push({ card, enter, leave });
    });
    return () => handlers.forEach(({ card, enter, leave }) => { card.removeEventListener("mouseenter", enter); card.removeEventListener("mouseleave", leave); });
  }, [loaded]);

  return (<><style jsx global>{`
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Instrument+Sans:wght@400;500;600;700&display=swap");
:root{--bg:#020202;--bg2:#080808;--surface:#0c0c0c;--border:#1a1a1a;--border-hi:#2e2e2e;--text:#eaeaea;--text-dim:#777;--text-muted:#444;--white:#fff;--font-display:"Outfit",sans-serif;--font-body:"Instrument Sans",sans-serif}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth;cursor:none}body{background:var(--bg);color:var(--text);font-family:var(--font-body);overflow-x:hidden;cursor:none}a,button{cursor:none}::selection{background:rgba(255,255,255,.12);color:#fff}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--border-hi);border-radius:2px}
.cursor-dot{position:fixed;top:0;left:0;z-index:99999;pointer-events:none;width:8px;height:8px;background:var(--white);border-radius:50%;transition:transform .15s ease,opacity .3s;mix-blend-mode:difference}
.cursor-ring{position:fixed;top:0;left:0;z-index:99998;pointer-events:none;width:40px;height:40px;border:1px solid rgba(255,255,255,.3);border-radius:50%;transition:all .25s cubic-bezier(.16,1,.3,1);mix-blend-mode:difference}.cursor-ring.hover{width:64px;height:64px;border-color:rgba(255,255,255,.5)}
.page-loader{position:fixed;inset:0;z-index:10000;background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;transition:opacity .6s cubic-bezier(.16,1,.3,1) .1s,visibility .6s}.page-loader.done{opacity:0;visibility:hidden;pointer-events:none}
.loader-logo{animation:loaderPulse 1.2s ease-in-out infinite}@keyframes loaderPulse{0%,100%{opacity:.3;transform:scale(.96)}50%{opacity:1;transform:scale(1)}}
.loader-bar{width:100px;height:1px;background:var(--border);overflow:hidden}.loader-fill{width:100%;height:100%;background:var(--white);animation:loaderSlide .8s ease-in-out infinite}@keyframes loaderSlide{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
.noise{position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:.02;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:256px}
.vignette{position:fixed;inset:0;z-index:9997;pointer-events:none;background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,.5) 100%)}
.grid-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px);background-size:80px 80px;mask-image:radial-gradient(ellipse 65% 55% at 50% 50%,black 10%,transparent 70%);-webkit-mask-image:radial-gradient(ellipse 65% 55% at 50% 50%,black 10%,transparent 70%);animation:gridFade 10s ease-in-out infinite}@keyframes gridFade{0%,100%{opacity:1}50%{opacity:.4}}
.orb{position:absolute;border-radius:50%;filter:blur(100px);will-change:transform}.orb1{width:600px;height:600px;background:radial-gradient(circle,rgba(255,255,255,.035),transparent 70%);top:-200px;right:-100px;animation:orbFloat 20s ease-in-out infinite}.orb2{width:400px;height:400px;background:radial-gradient(circle,rgba(255,255,255,.025),transparent 70%);bottom:-100px;left:-100px;animation:orbFloat 26s ease-in-out infinite reverse}.orb3{width:250px;height:250px;background:radial-gradient(circle,rgba(255,255,255,.02),transparent 70%);top:35%;left:15%;animation:orbFloat 22s ease-in-out infinite 4s}
@keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(50px,-40px) scale(1.1)}50%{transform:translate(-30px,40px) scale(.9)}75%{transform:translate(40px,20px) scale(1.05)}}
.deco-line{position:absolute;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)}.dl1{top:20%;left:0;width:35%;animation:lineGrow 1.5s 1s cubic-bezier(.16,1,.3,1) forwards;transform:scaleX(0);transform-origin:left}.dl2{bottom:25%;right:0;width:28%;animation:lineGrow 1.5s 1.3s cubic-bezier(.16,1,.3,1) forwards;transform:scaleX(0);transform-origin:right}.dl3{top:55%;left:8%;width:15%;animation:lineGrow 1.5s 1.6s cubic-bezier(.16,1,.3,1) forwards;transform:scaleX(0);transform-origin:left}
@keyframes lineGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}@keyframes breathe{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.08}50%{transform:translate(-50%,-50%) scale(1.4);opacity:.03}}@keyframes spinSlow{from{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes spinSlowRev{from{transform:rotate(360deg)}to{transform:rotate(0)}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}@keyframes floatDelay{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}@keyframes slideDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}@keyframes strokeDraw{from{stroke-dashoffset:1000}to{stroke-dashoffset:0}}@keyframes shimmer{0%{background-position:-300% 0}100%{background-position:300% 0}}
.reveal{opacity:0;transform:translateY(60px);transition:all 1s cubic-bezier(.16,1,.3,1)}.reveal.vis{opacity:1;transform:translateY(0)}.reveal.d1{transition-delay:120ms}.reveal.d2{transition-delay:240ms}.reveal.d3{transition-delay:360ms}.reveal.d4{transition-delay:480ms}.reveal.d5{transition-delay:600ms}.reveal.d6{transition-delay:720ms}.reveal.d7{transition-delay:840ms}.reveal.d8{transition-delay:960ms}
.tc{background:linear-gradient(120deg,#fff 0%,#999 30%,#fff 50%,#888 70%,#fff 100%);background-size:300% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 8s linear infinite}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:28px 0;transition:all .5s cubic-bezier(.16,1,.3,1);animation:slideDown .8s .7s both}nav.scrolled{backdrop-filter:blur(30px) saturate(180%);background:rgba(2,2,2,.88);border-bottom:1px solid var(--border);padding:14px 0}
.nav-inner{max-width:1360px;margin:0 auto;padding:0 36px;display:flex;align-items:center;justify-content:space-between}.nav-logo{display:flex;align-items:center;gap:14px;text-decoration:none}.logo-text{font-family:var(--font-display);font-size:22px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--white)}
.nav-links{display:flex;align-items:center;gap:44px}.nav-links a{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);text-decoration:none;font-weight:600;transition:color .4s;position:relative}.nav-links a:hover{color:var(--white)}.nav-links a::after{content:'';position:absolute;bottom:-6px;left:0;width:0;height:1px;background:var(--white);transition:width .5s cubic-bezier(.16,1,.3,1)}.nav-links a:hover::after{width:100%}
.nav-cta{margin-left:20px!important;padding:10px 28px!important;border:1px solid var(--border-hi)!important;transition:all .5s!important}.nav-cta:hover{background:var(--white)!important;color:var(--bg)!important;box-shadow:0 0 40px rgba(255,255,255,.08)!important}
.mob-btn{display:none;background:none;border:none;padding:10px;flex-direction:column;gap:6px;z-index:200}.mob-btn span{display:block;width:26px;height:1.5px;background:var(--white);transition:all .4s cubic-bezier(.16,1,.3,1);transform-origin:center}.mob-btn.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}.mob-btn.open span:nth-child(2){opacity:0;transform:scaleX(0)}.mob-btn.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}
.mob-menu{position:fixed;inset:0;z-index:99;background:rgba(2,2,2,.97);backdrop-filter:blur(40px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:36px;opacity:0;visibility:hidden;transition:all .6s cubic-bezier(.16,1,.3,1)}.mob-menu.open{opacity:1;visibility:visible}.mob-menu a{font-family:var(--font-display);font-size:32px;font-weight:700;color:var(--white);text-decoration:none;letter-spacing:.03em;opacity:0;transform:translateY(30px) scale(.95);transition:all .5s cubic-bezier(.16,1,.3,1)}.mob-menu.open a{opacity:1;transform:translateY(0) scale(1)}.mob-menu.open a:nth-child(1){transition-delay:.1s}.mob-menu.open a:nth-child(2){transition-delay:.15s}.mob-menu.open a:nth-child(3){transition-delay:.2s}.mob-menu.open a:nth-child(4){transition-delay:.25s}.mob-menu.open a:nth-child(5){transition-delay:.3s}
.hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden}.hero-inner{position:relative;z-index:10;max-width:1360px;margin:0 auto;padding:0 36px;text-align:center}
.pill{display:inline-flex;align-items:center;margin-top:122px;gap:12px;padding:10px 24px;border:1px solid var(--border);border-radius:999px;margin-bottom:52px;position:relative;overflow:hidden}.pill::before{content:'';position:absolute;inset:0;margin-top:82px;border-radius:999px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.03),transparent);animation:shimmer 4s linear infinite;background-size:300% 100%}.pill-dot{width:8px;height:8px;border-radius:50%;background:var(--white);animation:pulse 2s infinite;box-shadow:0 0 12px rgba(255,255,255,.3)}.pill-text{font-size:10px;letter-spacing:.35em;text-transform:uppercase;color:var(--text-dim);font-weight:600}
.hero h1{font-family:var(--font-display);font-size:clamp(3.5rem,10vw,8rem);font-weight:900;line-height:.9;letter-spacing:-.04em;min-height:2em}.hero-scramble{font-family:var(--font-display);display:inline-block}
.hero-underline{position:absolute;bottom:-12px;left:0;width:100%;overflow:visible}.hero-underline path{stroke-dasharray:400;stroke-dashoffset:400;animation:strokeDraw 2s 1.5s cubic-bezier(.16,1,.3,1) forwards}
.hero p{margin-top:40px;max-width:500px;margin-left:auto;margin-right:auto;font-size:clamp(.95rem,1.8vw,1.15rem);color:var(--text-dim);line-height:1.9;font-weight:400}.hero-btns{margin-top:56px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:20px}
.btn-primary{padding:18px 40px;background:var(--white);color:var(--bg);font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:14px;transition:all .5s cubic-bezier(.16,1,.3,1);font-family:var(--font-body);position:relative;overflow:hidden}.btn-primary::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(0,0,0,.05),transparent);transition:left .6s}.btn-primary:hover::after{left:100%}.btn-primary:hover{box-shadow:0 12px 50px rgba(255,255,255,.12);transform:translateY(-3px)}
.btn-secondary{padding:18px 40px;border:1px solid var(--border-hi);color:var(--text-dim);font-size:11px;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;font-weight:600;transition:all .5s;font-family:var(--font-body)}.btn-secondary:hover{border-color:var(--white);color:var(--white);box-shadow:0 0 30px rgba(255,255,255,.05)}
.btn-outline{display:inline-flex;align-items:center;gap:14px;padding:15px 30px;border:1px solid var(--border-hi);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--white);text-decoration:none;font-weight:600;transition:all .5s;font-family:var(--font-body);position:relative;overflow:hidden}.btn-outline::before{content:'';position:absolute;inset:0;background:var(--white);transform:translateY(100%);transition:transform .5s cubic-bezier(.16,1,.3,1)}.btn-outline:hover::before{transform:translateY(0)}.btn-outline:hover{color:var(--bg);border-color:var(--white)}.btn-outline span,.btn-outline .arrow-icon{position:relative;z-index:1}
.scroll-ind{position:absolute;bottom:44px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:14px}.scroll-ind span{font-size:9px;letter-spacing:.5em;text-transform:uppercase;color:var(--text-muted);font-weight:600}.scroll-line{width:1px;height:50px;background:linear-gradient(to bottom,var(--text-muted),transparent);animation:pulse 3s infinite}
section{position:relative}.section-wrap{max-width:1360px;margin:0 auto;padding:0 36px}.section-header{display:flex;flex-direction:column;gap:24px;margin-bottom:88px}
.section-label{font-size:10px;letter-spacing:.4em;text-transform:uppercase;color:var(--text-muted);font-weight:700;display:inline-flex;align-items:center;gap:16px;margin-bottom:16px}.section-label::before{content:'';width:32px;height:1px;background:var(--border-hi)}
.section-title{font-family:var(--font-display);font-size:clamp(2.5rem,5vw,4.25rem);font-weight:800;letter-spacing:-.04em}.section-desc{max-width:420px;color:var(--text-dim);line-height:1.9;font-weight:400}.divider{width:100%;height:1px;background:linear-gradient(90deg,transparent,var(--border) 15%,var(--border) 85%,transparent)}
.services-grid{display:grid;grid-template-columns:1fr;gap:1px;background:var(--border)}.service-card{position:relative;padding:56px;background:var(--bg);transition:all .6s cubic-bezier(.16,1,.3,1);overflow:hidden}.service-card::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 70% 0%,rgba(255,255,255,.02),transparent 60%);opacity:0;transition:opacity .8s}.service-card:hover{background:var(--surface)}.service-card:hover::before{opacity:1}
.service-card .corner{position:absolute;top:0;right:0;width:72px;height:72px;border-top:1px solid var(--border);border-right:1px solid var(--border);transition:all .7s cubic-bezier(.16,1,.3,1)}.service-card:hover .corner{border-color:var(--text-muted);width:100px;height:100px}
.service-num{font-size:48px;font-family:var(--font-display);color:rgba(255,255,255,.03);font-weight:900;letter-spacing:-.04em;margin-bottom:20px;transition:color .6s}.service-card:hover .service-num{color:rgba(255,255,255,.06)}
.service-card h3{font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2.1rem);font-weight:700;color:var(--white);margin-bottom:16px;letter-spacing:-.02em}.service-card p{color:var(--text-dim);line-height:1.9;margin-bottom:36px;max-width:400px;font-weight:400}
.tags{display:flex;flex-wrap:wrap;gap:8px}.tag{padding:6px 16px;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted);border:1px solid var(--border);font-weight:600;transition:all .5s}.service-card:hover .tag{border-color:var(--border-hi);color:var(--text-dim)}
.service-arrow{position:absolute;bottom:56px;right:56px;opacity:0;transition:all .6s cubic-bezier(.16,1,.3,1);transform:translate(12px,12px);color:var(--text-dim)}.service-card:hover .service-arrow{opacity:1;transform:translate(0,0)}
.projects-list{display:flex;flex-direction:column;gap:48px}.project-card{position:relative;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:24px;transition:all .8s cubic-bezier(.16,1,.3,1);cursor:pointer}.project-card:hover{border-color:var(--border-hi);transform:translateY(-8px);box-shadow:0 50px 120px rgba(0,0,0,.5),0 0 1px rgba(255,255,255,.05)}
.project-visual{position:relative;height:clamp(260px,40vw,540px);overflow:hidden;transition:transform 1s cubic-bezier(.16,1,.3,1)}.project-card:hover .project-visual{transform:scale(1.04)}.project-visual::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 25%,var(--bg) 100%);pointer-events:none}
.project-cat{position:absolute;top:28px;left:28px;z-index:2;padding:8px 16px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;color:var(--text-dim);background:rgba(2,2,2,.65);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.04);border-radius:6px}
.project-metric{position:absolute;top:28px;right:28px;z-index:2;text-align:right}.project-metric .val{display:block;font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2.75rem);font-weight:800;color:rgba(255,255,255,.85);letter-spacing:-.02em}.project-metric .lbl{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted);font-weight:600}
.project-info{position:relative;z-index:2;padding:40px;margin-top:-100px}.project-info h3{font-family:var(--font-display);font-size:clamp(1.75rem,4vw,3rem);font-weight:800;color:var(--white);margin-bottom:16px;letter-spacing:-.03em}.project-info p{color:var(--text-dim);line-height:1.9;max-width:640px;margin-bottom:36px;font-weight:400}
.project-footer{display:flex;flex-wrap:wrap;align-items:center;gap:12px}.tech-tag{padding:6px 16px;font-size:10px;letter-spacing:.12em;font-weight:600;color:var(--text-muted);border:1px solid var(--border);transition:all .6s}.project-card:hover .tech-tag{border-color:var(--border-hi);color:var(--text-dim)}
.case-link{margin-left:auto;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--text-muted);font-weight:600;display:flex;align-items:center;gap:10px;transition:all .6s}.project-card:hover .case-link{color:var(--white);letter-spacing:.25em}
.shapes{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}.shape-box{position:relative;width:clamp(200px,30vw,420px);height:clamp(200px,30vw,420px)}.shape-box>div{transition:transform .9s cubic-bezier(.16,1,.3,1)}
.shape-spin{position:absolute;animation:spinSlow 50s linear infinite}.shape-spin-rev{position:absolute;animation:spinSlowRev 60s linear infinite}.shape-float{animation:float 4s ease-in-out infinite}.shape-float-delay{animation:floatDelay 5s ease-in-out infinite}.shape-breathe{animation:breathe 5s ease-in-out infinite}
.marquee-wrap{overflow:hidden;padding:96px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);position:relative}.marquee-wrap::before,.marquee-wrap::after{content:'';position:absolute;top:0;bottom:0;width:150px;z-index:2;pointer-events:none}.marquee-wrap::before{left:0;background:linear-gradient(90deg,var(--bg),transparent)}.marquee-wrap::after{right:0;background:linear-gradient(270deg,var(--bg),transparent)}
.marquee-track{display:flex;animation:marquee 40s linear infinite;width:max-content}.marquee-track:hover{animation-play-state:paused}.stat-item{display:flex;align-items:center;gap:24px;white-space:nowrap;padding:0 44px}.stat-val{font-family:var(--font-display);font-size:clamp(2rem,4vw,3.5rem);font-weight:800;color:var(--white);font-variant-numeric:tabular-nums;letter-spacing:-.02em}.stat-lbl{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:var(--text-muted);font-weight:600}.stat-dot{color:var(--border);font-size:24px}
.about-grid{display:grid;grid-template-columns:1fr;gap:64px;align-items:center}.about-visual{position:relative;aspect-ratio:1;max-width:520px;margin:0 auto}.about-frame{position:absolute;inset:0;border:1px solid var(--border);transform:rotate(3deg);transition:all .8s cubic-bezier(.16,1,.3,1)}.about-visual:hover .about-frame{transform:rotate(.5deg);border-color:var(--border-hi)}.about-frame-inner{position:absolute;inset:18px;border:1px solid rgba(255,255,255,.03);transform:rotate(-2deg);transition:transform .8s}.about-visual:hover .about-frame-inner{transform:rotate(-.5deg)}.about-frame-bg{position:absolute;inset:36px;background:var(--surface)}
.about-logo{inset:0;display:flex;align-items:center;justify-content:center;z-index:10}.about-logo-img{opacity:.6;transition:all .8s cubic-bezier(.16,1,.3,1);filter:drop-shadow(0 0 30px rgba(255,255,255,.05))}.about-visual:hover .about-logo-img{opacity:1;filter:drop-shadow(0 0 60px rgba(255,255,255,.1));transform:scale(1.08) rotate(-2deg)}
.about-corner-tl{position:absolute;top:-14px;left:-14px;width:28px;height:28px;border-top:1px solid var(--border-hi);border-left:1px solid var(--border-hi)}.about-corner-br{position:absolute;bottom:-14px;right:-14px;width:28px;height:28px;border-bottom:1px solid var(--border-hi);border-right:1px solid var(--border-hi)}.about-corner-tr{position:absolute;top:-14px;right:-14px;width:14px;height:14px;border-top:1px solid rgba(255,255,255,.06);border-right:1px solid rgba(255,255,255,.06)}.about-corner-bl{position:absolute;bottom:-14px;left:-14px;width:14px;height:14px;border-bottom:1px solid rgba(255,255,255,.06);border-left:1px solid rgba(255,255,255,.06)}
.about-text h2{font-family:var(--font-display);font-size:clamp(2rem,5vw,3.5rem);font-weight:800;letter-spacing:-.04em;margin-bottom:36px}.about-text .lead{color:var(--text-dim);line-height:1.9;margin-bottom:24px;font-size:clamp(1rem,1.5vw,1.125rem);font-weight:400}.about-text .body{color:var(--text-muted);line-height:1.9;margin-bottom:48px;font-weight:400}
.cta{padding:160px 0;overflow:hidden;position:relative;text-align:center}.cta-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:800px;height:800px;background:rgba(255,255,255,.015);border-radius:50%;filter:blur(120px);animation:breathe 10s ease-in-out infinite}
.cta-ring{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:550px;height:550px;border:1px solid var(--border);border-radius:50%;animation:spinSlow 80s linear infinite}.cta-ring::after{content:'';position:absolute;top:-4px;left:50%;width:8px;height:8px;background:rgba(255,255,255,.25);border-radius:50%;box-shadow:0 0 20px rgba(255,255,255,.15)}
.cta-ring-2{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:400px;height:400px;border:1px solid rgba(255,255,255,.03);border-radius:50%;animation:spinSlowRev 60s linear infinite}
.cta-inner{position:relative;z-index:10;max-width:800px;margin:0 auto;padding:0 36px}.cta h2{font-family:var(--font-display);font-size:clamp(2.5rem,7vw,5.5rem);font-weight:900;letter-spacing:-.04em;margin-bottom:32px}.cta p{color:var(--text-dim);font-size:clamp(1rem,2vw,1.15rem);line-height:1.9;max-width:520px;margin:0 auto 56px;font-weight:400}.cta-btns{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:20px}
footer{border-top:1px solid var(--border);padding:80px 0}.footer-grid{display:grid;grid-template-columns:1fr;gap:48px;margin-bottom:72px}.footer-brand p{color:var(--text-muted);line-height:1.9;max-width:340px;font-size:13px;margin-top:28px;font-weight:400}
.footer-col h4{font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:var(--text-muted);font-weight:700;margin-bottom:28px}.footer-col a{display:block;font-size:13px;color:var(--text-dim);text-decoration:none;margin-bottom:16px;transition:all .4s;font-weight:400;position:relative;padding-left:0}.footer-col a:hover{color:var(--white);padding-left:12px}.footer-col a::before{content:'';position:absolute;left:0;top:50%;width:0;height:1px;background:var(--white);transition:width .4s cubic-bezier(.16,1,.3,1);transform:translateY(-50%)}.footer-col a:hover::before{width:6px}
.footer-bottom{padding-top:36px;border-top:1px solid rgba(255,255,255,.03);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px}.footer-bottom span{font-size:11px;color:var(--text-muted);letter-spacing:.05em}.footer-bottom a{font-size:11px;color:var(--text-muted);text-decoration:none;transition:color .3s}.footer-bottom a:hover{color:var(--text-dim)}
.arrow-icon{width:16px;height:16px;transition:transform .5s cubic-bezier(.16,1,.3,1)}.btn-primary:hover .arrow-icon,.btn-outline:hover .arrow-icon,.project-card:hover .case-link .arrow-icon{transform:translateX(6px)}
@media(min-width:768px){.services-grid{grid-template-columns:1fr 1fr}.footer-grid{grid-template-columns:2fr 1fr 1fr}}
@media(min-width:1024px){.section-header{flex-direction:row;align-items:flex-end;justify-content:space-between}.stat-item{padding:0 56px}.about-grid{grid-template-columns:1fr 1fr;gap:100px}.project-info{padding:56px;margin-top:-110px}}
@media(max-width:768px){.nav-links{display:none}.mob-btn{display:flex}.orb{display:none}.project-info{padding:24px;margin-top:-60px}.cta-ring,.cta-ring-2{display:none}.dl3{display:none}.cursor-dot,.cursor-ring{display:none}html,body,a,button{cursor:auto!important}.vignette{display:none}}
@media(min-width:769px){.mob-btn{display:none}.mob-menu{display:none}}
  `}</style>

    <div ref={pageRef}>
      <div className="cursor-dot" style={{ transform: `translate(${cursorPos.x - 4}px, ${cursorPos.y - 4}px)` }} />
      <div className={`cursor-ring ${cursorHover ? "hover" : ""}`} style={{ transform: `translate(${cursorPos.x - 20}px, ${cursorPos.y - 20}px)` }} />
      <div className={`page-loader ${loaded ? "done" : ""}`}><div className="loader-logo"><Image src="/logo.png" alt="BRRICS" width={200} height={200} style={{ objectFit: "contain" }} /></div><div className="loader-bar"><div className="loader-fill" /></div></div>
      <div className="noise" /><div className="vignette" />
      <div className={`mob-menu ${menuOpen ? "open" : ""}`}>
        <a href="#services" onClick={() => setMenuOpen(false)}>Services</a><a href="#projects" onClick={() => setMenuOpen(false)}>Projects</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a><a href="#contact" onClick={() => setMenuOpen(false)}>Get in Touch</a>
      </div>

      <nav className={navScrolled ? "scrolled" : ""}>
        <div className="nav-inner">
          <a href="#" className="nav-logo"><Image src="/logo.png" alt="BRRICS" width={130} height={130} style={{ objectFit: "contain" }} priority /><span className="logo-text"></span></a>
          <div className="nav-links"><a href="#services">Services</a><a href="#projects">Projects</a><a href="#about">About</a><a href="#contact">Contact</a><a href="#contact" className="nav-cta">Get in Touch</a></div>
          <button className={`mob-btn ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"><span /><span /><span /></button>
        </div>
      </nav>

      <section className="hero" ref={heroRef.ref}>
        <div className="grid-bg" /><div className="orb orb1" style={{ transform: `translate(${mouse.x*25}px, ${mouse.y*25}px)` }} /><div className="orb orb2" style={{ transform: `translate(${mouse.x*-18}px, ${mouse.y*-18}px)` }} /><div className="orb orb3" style={{ transform: `translate(${mouse.x*12}px, ${mouse.y*12}px)` }} />
        <div className="deco-line dl1" /><div className="deco-line dl2" /><div className="deco-line dl3" />
        <div className="hero-inner">
          <div className="pill reveal"><span className="pill-dot" /><span className="pill-text">Technology Platform — Est. 2026</span></div>
          <h1 className="reveal d1"><span className="tc hero-scramble">{heroLine1 || "\u00A0"}</span><br /><span className="tc hero-scramble" style={{ position: "relative", display: "inline-block" }}>{heroLine2 || "\u00A0"}<svg className="hero-underline" viewBox="0 0 300 12" fill="none"><path d="M2 8C50 3 100 2 150 5C200 8 250 4 298 6" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeLinecap="round" /></svg></span></h1>
          <p className="reveal d3">Strategy. Design. Engineering.<br />Crafting Digital experiences that matter.</p>
          <div className="hero-btns reveal d5"><MagneticWrap><a href="#projects" className="btn-primary">View Our Work <ArrowRight /></a></MagneticWrap><MagneticWrap><a href="#contact" className="btn-secondary">Start a Project</a></MagneticWrap></div>
        </div>
        <div className="scroll-ind reveal d8"><span>Scroll</span><div className="scroll-line" /></div>
      </section>

      <section id="services" style={{ padding: "150px 0" }}><div className="section-wrap">
        <div className="section-header"><div><span className="section-label reveal">What We Do</span><h2 className="section-title tc reveal d1">Services</h2></div><p className="section-desc reveal d2">End-to-end digital capabilities. From first concept to final deployment, we cover every layer of the stack.</p></div>
        <div className="services-grid">{services.map((s, i) => (<div key={s.num} className={`service-card reveal d${i + 2}`}><div className="corner" /><div className="service-num">{s.num}</div><h3>{s.title}</h3><p>{s.desc}</p><div className="tags">{s.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div><div className="service-arrow"><ArrowUpRight /></div></div>))}</div>
      </div></section>

      <div className="divider" />

      <section id="projects" style={{ padding: "150px 0" }}><div className="section-wrap">
        <div className="section-header"><div><span className="section-label reveal">Selected Work</span><h2 className="section-title tc reveal d1">Projects</h2></div><p className="section-desc reveal d2">Complex problems, elegant solutions. Here are some of the projects we&apos;re most proud of.</p></div>
        <div className="projects-list">{projects.map((p, i) => (<div key={p.title} className={`project-card reveal d${i + 2}`}><div className="project-visual" style={{ background: p.gradient }}><ProjectShapes color={p.shapeColor} type={p.shapes} /><div className="project-cat">{p.cat}</div><div className="project-metric"><span className="val">{p.metricVal}</span><span className="lbl">{p.metricLbl}</span></div></div><div className="project-info"><h3>{p.title}</h3><p>{p.desc}</p><div className="project-footer">{p.techs.map((t) => <span key={t} className="tech-tag">{t}</span>)}<span className="case-link">View Case Study <ArrowRight /></span></div></div></div>))}</div>
      </div></section>

      <div className="marquee-wrap"><div className="marquee-track">{[0, 1].map((dup) => (<div key={dup} style={{ display: "flex", alignItems: "center" }}>{statsData.map((s) => (<StatCounter key={`${dup}-${s.lbl}`} target={s.val} suffix={s.suffix} label={s.lbl} />))}</div>))}</div></div>

      <section id="about" style={{ padding: "150px 0" }}><div className="section-wrap"><div className="about-grid">
        <div className="about-visual reveal d2"><div className="about-frame"><div className="about-frame-inner" /><div className="about-frame-bg" /></div><div className="about-logo"><Image src="/logo.png" alt="BRRICS" width={400} height={150} className="about-logo-img" style={{ objectFit: "contain" }} /></div><div className="about-corner-tl" /><div className="about-corner-br" /><div className="about-corner-tr" /><div className="about-corner-bl" /></div>
        <div className="about-text"><span className="section-label reveal">Who We Are</span><h2 className="reveal d1"><span className="tc">Obsessed with<br />craft &amp; impact</span></h2><p className="lead reveal d2">BRRICS is a collective of strategists, designers, and engineers united by a single belief: technology should amplify human potential, not complicate it.</p><p className="body reveal d3">We don&apos;t just build products — we architect experiences that define industries. From stealth startups to Fortune 500s, our work speaks for itself.</p><MagneticWrap className="reveal d4"><a href="#contact" className="btn-outline"><span>Learn More</span> <ArrowRight /></a></MagneticWrap></div>
      </div></div></section>

      <div className="divider" />

      <section id="contact" className="cta"><div className="cta-glow" /><div className="cta-ring" /><div className="cta-ring-2" /><div className="cta-inner">
        <span className="section-label reveal">Ready to start?</span><h2 className="reveal d1"><span className="tc">Let&apos;s build<br />something great</span></h2><p className="reveal d2">Got an idea that needs a world-class team? We&apos;re selective about the projects we take on — but if it&apos;s ambitious, we&apos;re in.</p>
        <div className="cta-btns reveal d3"><MagneticWrap><a href="mailto:hello@brrics.com" className="btn-primary">hello@brrics.com <ArrowRight /></a></MagneticWrap><MagneticWrap><a href="#" className="btn-secondary">Book a Call</a></MagneticWrap></div>
      </div></section>

      <footer><div className="section-wrap">
        <div className="footer-grid">
          <div className="footer-brand"><div style={{ display: "flex", alignItems: "center", gap: 14 }}><Image src="/logo.png" alt="BRRICS" width={100} height={100} style={{ objectFit: "contain" }} /><span className="logo-text" style={{ fontSize: 16 }}>Brrics</span></div><p>A futuristic digital agency crafting bold digital experiences. Strategy. Design. Engineering. Scale.</p></div>
          <div className="footer-col"><h4>Navigation</h4><a href="#services">Services</a><a href="#projects">Projects</a><a href="#about">About</a><a href="#contact">Contact</a></div>
          <div className="footer-col"><h4>Connect</h4><a href="#">Twitter / X</a><a href="#">LinkedIn</a><a href="#">Dribbble</a><a href="#">GitHub</a></div>
        </div>
        <div className="footer-bottom"><span>&copy; 2024 BRRICS. All rights reserved.</span><div style={{ display: "flex", gap: 24 }}><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div></div>
      </div></footer>
    </div>
  </>);
}