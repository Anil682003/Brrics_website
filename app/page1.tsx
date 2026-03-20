"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/* ══════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════ */
interface ServiceItem {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  icon: React.ReactNode;
}

interface ProjectItem {
  title: string;
  desc: string;
  cat: string;
  metricVal: string;
  metricLbl: string;
  techs: string[];
  gradient: string;
  shapeColor: string;
  shapes: "rounded" | "circles" | "diamonds";
}

interface StatItem {
  val: number;
  suffix: string;
  lbl: string;
}

/* ══════════════════════════════════════════════
   ICONS
   ══════════════════════════════════════════════ */
const ArrowRight = ({ className = "" }: { className?: string }) => (
  <svg className={`arrow-icon ${className}`} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ArrowUpRight = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
  </svg>
);

/* ══════════════════════════════════════════════
   TEXT SCRAMBLE HOOK
   ══════════════════════════════════════════════ */
function useTextScramble(text: string, trigger: boolean, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  const chars = "!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    if (!trigger) return;
    let frame = 0;
    const totalFrames = text.length * 2;
    const interval = setInterval(() => {
      const progress = frame / totalFrames;
      const resolved = Math.floor(progress * text.length);
      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else if (i < resolved) {
          result += text[i];
        } else if (i < resolved + 4) {
          result += chars[Math.floor(Math.random() * chars.length)];
        } else {
          result += " ";
        }
      }
      setDisplayed(result);
      frame++;
      if (frame > totalFrames) {
        setDisplayed(text);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [trigger, text, speed]);

  return displayed;
}

/* ══════════════════════════════════════════════
   ANIMATED COUNTER HOOK
   ══════════════════════════════════════════════ */
function useCounter(target: number, trigger: boolean, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);

  return count;
}

/* ══════════════════════════════════════════════
   INTERSECTION OBSERVER HOOK
   ══════════════════════════════════════════════ */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL HOOK
   ══════════════════════════════════════════════ */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    el.querySelectorAll(".reveal").forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ══════════════════════════════════════════════
   MOUSE PARALLAX HOOK
   ══════════════════════════════════════════════ */
function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return pos;
}

/* ══════════════════════════════════════════════
   STAT COUNTER COMPONENT
   ══════════════════════════════════════════════ */
function StatCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, inView } = useInView(0.3);
  const count = useCounter(target, inView);

  return (
    <div ref={ref} className="stat-item">
      <span className="stat-val">
        {count}
        {suffix}
      </span>
      <span className="stat-lbl">{label}</span>
      <span className="stat-dot">•</span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════ */
const services: ServiceItem[] = [
  {
    num: "01",
    title: "Digital Strategy",
    desc: "Data-driven roadmaps that align technology with business goals. We decode market complexity into actionable digital blueprints.",
    tags: ["Research", "Analytics", "Roadmapping"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
        <circle cx="12" cy="12" r="10" /><path d="M12 2v20M2 12h20" strokeDasharray="2 3" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Design & Branding",
    desc: "Visual identities that cut through noise. From brand systems to immersive interfaces, every pixel serves a purpose.",
    tags: ["UI/UX", "Brand Identity", "Motion Design"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
        <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M3 9h18M9 3v18" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Development",
    desc: "Engineered for scale. We build performant, resilient applications using modern stacks and battle-tested architecture.",
    tags: ["Web Apps", "Mobile", "Cloud Infrastructure"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
        <path d="M7 8l-4 4 4 4M17 8l4 4-4 4M14 4l-4 16" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Growth & Launch",
    desc: "From MVP to market dominance. We orchestrate launches, optimize funnels, and accelerate traction with precision.",
    tags: ["SEO", "Performance", "Launch Strategy"],
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
      </svg>
    ),
  },
];

const projects: ProjectItem[] = [
  {
    title: "Neural Commerce Platform",
    desc: "A next-gen e-commerce ecosystem powered by real-time AI personalization. Predictive inventory, dynamic pricing, and a conversational shopping interface that boosted conversion by 340%.",
    cat: "E-Commerce · AI Integration",
    metricVal: "340%",
    metricLbl: "Conversion Uplift",
    techs: ["Next.js", "Python", "TensorFlow", "AWS"],
    gradient: "linear-gradient(135deg, rgba(100,50,150,0.4), rgba(60,20,100,0.25), transparent)",
    shapeColor: "139,92,246",
    shapes: "rounded",
  },
  {
    title: "Orbital — Fintech Dashboard",
    desc: "Real-time financial analytics platform processing 2M+ transactions daily. Interactive 3D data visualizations, custom charting engine, and sub-100ms query response times.",
    cat: "Finance · Data Visualization",
    metricVal: "2M+",
    metricLbl: "Daily Transactions",
    techs: ["React", "Go", "PostgreSQL", "WebGL"],
    gradient: "linear-gradient(135deg, rgba(20,100,150,0.4), rgba(10,50,120,0.25), transparent)",
    shapeColor: "56,189,248",
    shapes: "circles",
  },
  {
    title: "Meridian Health System",
    desc: "Connected health monitoring platform integrating 50K+ IoT devices. HIPAA-compliant infrastructure with real-time patient data streams and predictive alert systems.",
    cat: "Healthcare · IoT Platform",
    metricVal: "50K+",
    metricLbl: "Connected Devices",
    techs: ["TypeScript", "Rust", "MQTT", "GCP"],
    gradient: "linear-gradient(135deg, rgba(16,120,80,0.4), rgba(10,80,50,0.25), transparent)",
    shapeColor: "52,211,153",
    shapes: "diamonds",
  },
];

const statsData: StatItem[] = [
  { val: 50, suffix: "+", lbl: "Projects Delivered" },
  { val: 98, suffix: "%", lbl: "Client Satisfaction" },
  { val: 15, suffix: "+", lbl: "Industries Served" },
  { val: 49, suffix: "", lbl: "Average Rating" },
  { val: 30, suffix: "+", lbl: "Team Members" },
  { val: 12, suffix: "+", lbl: "Countries Reached" },
];

/* ══════════════════════════════════════════════
   SHAPE COMPONENTS
   ══════════════════════════════════════════════ */
function ProjectShapes({ color, type }: { color: string; type: string }) {
  if (type === "circles") {
    return (
      <div className="shapes">
        <div className="shape-box">
          <div className="shape-orbit" style={{ inset: 0, border: `1px solid rgba(${color}, 0.15)`, borderRadius: "50%" }} />
          <div className="shape-orbit" style={{ inset: 48, border: `1px solid rgba(${color}, 0.1)`, borderRadius: "50%", animationDirection: "reverse" }} />
          <div className="shape-orbit" style={{ inset: 96, border: `1px solid rgba(${color}, 0.1)`, borderRadius: "50%" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 16, height: 16, background: `rgba(${color}, 0.4)`, borderRadius: "50%", boxShadow: `0 0 40px rgba(${color}, 0.3)` }} />
          <div className="shape-dot" style={{ top: 16, left: "50%", width: 8, height: 8, background: `rgba(${color}, 0.3)`, borderRadius: "50%" }} />
          <div className="shape-dot" style={{ bottom: 32, right: 48, width: 8, height: 8, background: `rgba(${color}, 0.3)`, borderRadius: "50%" }} />
        </div>
      </div>
    );
  }
  if (type === "diamonds") {
    return (
      <div className="shapes">
        <div className="shape-box">
          <div className="shape-orbit" style={{ inset: 16, border: `1px solid rgba(${color}, 0.15)`, transform: "rotate(45deg)" }} />
          <div className="shape-orbit" style={{ inset: 48, border: `1px solid rgba(${color}, 0.1)`, transform: "rotate(12deg)", animationDirection: "reverse" }} />
          <div style={{ position: "absolute", inset: 80, background: `rgba(${color}, 0.05)`, borderRadius: 4, transform: "rotate(-12deg)" }} />
          <div className="shape-dot" style={{ top: 32, right: 32, width: 12, height: 12, background: `rgba(${color}, 0.25)`, borderRadius: "50%", boxShadow: `0 0 20px rgba(${color}, 0.2)` }} />
          <div className="shape-dot" style={{ bottom: 48, left: 48, width: 8, height: 8, background: `rgba(${color}, 0.35)`, borderRadius: "50%", boxShadow: `0 0 15px rgba(${color}, 0.2)` }} />
        </div>
      </div>
    );
  }
  return (
    <div className="shapes">
      <div className="shape-box">
        <div className="shape-orbit" style={{ inset: 32, border: `1px solid rgba(${color}, 0.2)`, borderRadius: 16, transform: "rotate(12deg)" }} />
        <div className="shape-orbit" style={{ inset: 64, border: `1px solid rgba(${color}, 0.15)`, borderRadius: 12, transform: "rotate(-6deg)", animationDirection: "reverse" }} />
        <div style={{ position: "absolute", inset: 96, background: `rgba(${color}, 0.05)`, borderRadius: 8, transform: "rotate(3deg)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 80, height: 80, background: `rgba(${color}, 0.12)`, borderRadius: "50%", filter: "blur(20px)", animation: "breathe 4s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   PAGE COMPONENT
   ════════════════════════════════════════════════════ */
export default function BrricsPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pageRef = useScrollReveal();
  const mouse = useMouseParallax();
  const heroInView = useInView(0.1);
  const heroLine1 = useTextScramble("We Build", heroInView.inView && loaded, 35);
  const heroLine2 = useTextScramble("Digital Futures", heroInView.inView && loaded, 28);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax shapes on project hover
  useEffect(() => {
    const cards = document.querySelectorAll(".project-card");
    const handlers: Array<{ card: Element; enter: () => void; leave: () => void }> = [];
    cards.forEach((card) => {
      const shapes = card.querySelectorAll(".shape-box > div") as NodeListOf<HTMLElement>;
      const enter = () => {
        shapes.forEach((s) => {
          const r = (Math.random() - 0.5) * 24;
          const sc = 0.92 + Math.random() * 0.16;
          s.style.transform = `rotate(${r}deg) scale(${sc})`;
        });
      };
      const leave = () => shapes.forEach((s) => (s.style.transform = ""));
      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
      handlers.push({ card, enter, leave });
    });
    return () => handlers.forEach(({ card, enter, leave }) => {
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
    });
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap");

        :root {
          --bg: #020204;
          --surface: #0a0a0e;
          --border: #161620;
          --border-hi: #2a2a3a;
          --text: #e8e8f0;
          --text-dim: #666680;
          --text-muted: #44445a;
          --accent: rgba(120, 100, 255, 0.5);
          --glow: rgba(120, 100, 255, 0.08);
          --font-display: "Syne", sans-serif;
          --font-body: "DM Sans", sans-serif;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          overflow-x: hidden;
        }
        ::selection { background: rgba(120, 100, 255, 0.25); color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--border-hi); border-radius: 2px; }

        /* ─── PAGE LOADER ─── */
        .page-loader {
          position: fixed; inset: 0; z-index: 9998; background: var(--bg);
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.8s ease, visibility 0.8s ease;
        }
        .page-loader.done { opacity: 0; visibility: hidden; pointer-events: none; }
        .loader-bar {
          width: 120px; height: 2px; background: var(--border);
          overflow: hidden; border-radius: 1px;
        }
        .loader-bar::after {
          content: ''; display: block; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, #fff, transparent);
          animation: loaderSlide 0.8s ease-in-out infinite;
        }
        @keyframes loaderSlide { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }

        /* ─── NOISE + SCANLINES ─── */
        .noise {
          position: fixed; inset: 0; z-index: 9999; pointer-events: none; opacity: 0.018;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px;
        }
        .scanlines {
          position: fixed; inset: 0; z-index: 9998; pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
        }

        /* ─── GRID BG ─── */
        .grid-bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(120,100,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,100,255,0.03) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black 10%, transparent 70%);
          -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black 10%, transparent 70%);
          animation: gridPulse 8s ease-in-out infinite;
        }
        @keyframes gridPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        /* ─── FLOATING ORBS ─── */
        .glow1 {
          position: absolute; width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(120,100,255,0.06) 0%, transparent 70%);
          top: -250px; right: -150px; filter: blur(100px);
          animation: floatOrb 18s ease-in-out infinite; border-radius: 50%;
        }
        .glow2 {
          position: absolute; width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(80,200,255,0.04) 0%, transparent 70%);
          bottom: -150px; left: -150px; filter: blur(100px);
          animation: floatOrb 24s ease-in-out infinite reverse; border-radius: 50%;
        }
        .glow3 {
          position: absolute; width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(200,100,255,0.04) 0%, transparent 70%);
          top: 30%; left: 20%; filter: blur(80px);
          animation: floatOrb 22s ease-in-out infinite 5s; border-radius: 50%;
        }

        @keyframes floatOrb {
          0%, 100% { transform: translate(0,0) scale(1); }
          25% { transform: translate(40px,-40px) scale(1.08); }
          50% { transform: translate(-20px,30px) scale(0.92); }
          75% { transform: translate(30px,20px) scale(1.05); }
        }

        /* ─── ANIMATIONS ─── */
        @keyframes lineGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes breathe { 0%, 100% { transform: translate(-50%,-50%) scale(1); opacity:0.12; } 50% { transform: translate(-50%,-50%) scale(1.3); opacity:0.06; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes rotateOrbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(60px); } to { opacity:1; transform: translateY(0); } }
        @keyframes glowPulse { 0%, 100% { box-shadow: 0 0 20px rgba(120,100,255,0); } 50% { box-shadow: 0 0 40px rgba(120,100,255,0.08); } }
        @keyframes borderGlow {
          0%, 100% { border-color: var(--border); }
          50% { border-color: var(--border-hi); }
        }
        @keyframes slideDown { from { opacity:0; transform: translateY(-20px); } to { opacity:1; transform: translateY(0); } }

        /* ─── REVEAL SYSTEM ─── */
        .reveal { opacity: 0; transform: translateY(50px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.vis { opacity: 1; transform: translateY(0); }
        .reveal.d1 { transition-delay: 120ms; }
        .reveal.d2 { transition-delay: 240ms; }
        .reveal.d3 { transition-delay: 360ms; }
        .reveal.d4 { transition-delay: 480ms; }
        .reveal.d5 { transition-delay: 600ms; }
        .reveal.d6 { transition-delay: 720ms; }
        .reveal.d7 { transition-delay: 840ms; }
        .reveal.d8 { transition-delay: 960ms; }

        /* ─── CHROME TEXT ─── */
        .tc {
          background: linear-gradient(135deg, #fff 0%, #8080a0 40%, #fff 60%, #9090b0 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: shimmer 6s ease-in-out infinite;
        }

        /* ─── ANIMATED GRADIENT BORDER ─── */
        .glow-border {
          position: relative;
        }
        .glow-border::before {
          content: ''; position: absolute; inset: -1px; border-radius: inherit;
          background: linear-gradient(135deg, rgba(120,100,255,0.15), transparent 40%, transparent 60%, rgba(80,200,255,0.1));
          z-index: -1; opacity: 0; transition: opacity 0.6s;
        }
        .glow-border:hover::before { opacity: 1; }

        /* ─── NAV ─── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          padding: 24px 0; transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          animation: slideDown 0.8s 0.5s both;
        }
        nav.scrolled {
          backdrop-filter: blur(24px) saturate(180%);
          background: rgba(2, 2, 4, 0.85);
          border-bottom: 1px solid var(--border);
          padding: 14px 0;
        }
        .nav-inner {
          max-width: 1320px; margin: 0 auto; padding: 0 32px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .nav-logo { display: flex; align-items: center; gap: 14px; text-decoration: none; }
        .logo-text {
          font-family: var(--font-display); font-size: 20px; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase; color: #fff;
        }
        .nav-links { display: flex; align-items: center; gap: 40px; }
        .nav-links a {
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--text-dim); text-decoration: none; transition: all 0.4s;
          position: relative; font-weight: 500;
        }
        .nav-links a:hover { color: #fff; }
        .nav-links a::after {
          content: ''; position: absolute; bottom: -6px; left: 0; width: 0;
          height: 1px; background: linear-gradient(90deg, rgba(120,100,255,0.6), transparent);
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-links a:hover::after { width: 100%; }
        .nav-cta {
          margin-left: 20px !important;
          padding: 10px 24px !important;
          border: 1px solid var(--border-hi) !important;
          transition: all 0.4s !important;
        }
        .nav-cta:hover {
          background: #fff !important; color: var(--bg) !important;
          box-shadow: 0 0 30px rgba(255,255,255,0.1) !important;
        }

        /* Mobile menu btn */
        .mobile-menu-btn {
          display: none; background: none; border: none; cursor: pointer; padding: 8px;
          flex-direction: column; gap: 5px; z-index: 200;
        }
        .mobile-menu-btn span {
          display: block; width: 24px; height: 1.5px; background: #fff;
          transition: all 0.3s;
        }
        .mobile-menu-btn.open span:nth-child(1) { transform: rotate(45deg) translate(4px, 4px); }
        .mobile-menu-btn.open span:nth-child(2) { opacity: 0; }
        .mobile-menu-btn.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        .mobile-menu {
          position: fixed; inset: 0; z-index: 99; background: rgba(2,2,4,0.97);
          backdrop-filter: blur(30px); display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 32px;
          opacity: 0; visibility: hidden; transition: all 0.5s;
        }
        .mobile-menu.open { opacity: 1; visibility: visible; }
        .mobile-menu a {
          font-family: var(--font-display); font-size: 28px; font-weight: 600;
          color: #fff; text-decoration: none; letter-spacing: 0.05em;
          opacity: 0; transform: translateY(20px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .mobile-menu.open a { opacity: 1; transform: translateY(0); }
        .mobile-menu.open a:nth-child(1) { transition-delay: 0.1s; }
        .mobile-menu.open a:nth-child(2) { transition-delay: 0.15s; }
        .mobile-menu.open a:nth-child(3) { transition-delay: 0.2s; }
        .mobile-menu.open a:nth-child(4) { transition-delay: 0.25s; }
        .mobile-menu.open a:nth-child(5) { transition-delay: 0.3s; }

        /* ─── HERO ─── */
        .hero {
          position: relative; min-height: 100vh; display: flex;
          align-items: center; justify-content: center; overflow: hidden;
        }
        .hero-inner {
          position: relative; z-index: 10; max-width: 1320px;
          margin: 0 auto; padding: 0 32px; text-align: center;
        }
        .pill {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 8px 20px; border: 1px solid var(--border);
          border-radius: 999px; margin-bottom: 48px;
          animation: borderGlow 4s ease-in-out infinite;
        }
        .pill-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(120, 100, 255, 0.8);
          box-shadow: 0 0 12px rgba(120, 100, 255, 0.4);
          animation: pulse 2s infinite;
        }
        .pill-text {
          font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase;
          color: var(--text-dim); font-family: var(--font-body); font-weight: 500;
        }
        .hero h1 {
          font-family: var(--font-display);
          font-size: clamp(3.2rem, 9vw, 7.5rem);
          font-weight: 800; line-height: 0.92; letter-spacing: -0.03em;
          min-height: 2.1em;
        }
        .hero-scramble {
          font-family: var(--font-display);
          display: inline-block;
          min-width: 3ch;
        }
        .hero p {
          margin-top: 36px; max-width: 520px; margin-left: auto; margin-right: auto;
          font-size: clamp(1rem, 2vw, 1.2rem); color: var(--text-dim);
          line-height: 1.8; font-weight: 300;
        }
        .hero-btns {
          margin-top: 52px; display: flex; flex-wrap: wrap;
          align-items: center; justify-content: center; gap: 16px;
        }
        .btn-primary {
          padding: 16px 36px; background: #fff; color: var(--bg);
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          font-weight: 600; text-decoration: none; display: inline-flex;
          align-items: center; gap: 12px; transition: all 0.4s;
          font-family: var(--font-body);
          position: relative; overflow: hidden;
        }
        .btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(120,100,255,0.15), transparent);
          transform: translateX(-100%); transition: transform 0.6s;
        }
        .btn-primary:hover::before { transform: translateX(100%); }
        .btn-primary:hover { box-shadow: 0 8px 40px rgba(255,255,255,0.15); transform: translateY(-2px); }
        .btn-secondary {
          padding: 16px 36px; border: 1px solid var(--border-hi);
          color: var(--text-dim); font-size: 11px; letter-spacing: 0.2em;
          text-transform: uppercase; text-decoration: none;
          transition: all 0.4s; font-family: var(--font-body); font-weight: 500;
        }
        .btn-secondary:hover {
          border-color: rgba(120,100,255,0.4); color: #fff;
          box-shadow: 0 0 30px rgba(120,100,255,0.08);
        }
        .scroll-ind {
          position: absolute; bottom: 48px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .scroll-ind span { font-size: 9px; letter-spacing: 0.4em; text-transform: uppercase; color: var(--text-muted); }
        .scroll-line { width: 1px; height: 48px; background: linear-gradient(to bottom, var(--text-muted), transparent); animation: pulse 2.5s infinite; }

        /* Deco lines */
        .deco-line { position: absolute; height: 1px; background: linear-gradient(90deg, transparent, rgba(120,100,255,0.06), transparent); }
        .dl1 { top: 20%; left: 0; width: 35%; animation: lineGrow 1.2s 1.2s cubic-bezier(0.16,1,0.3,1) forwards; transform: scaleX(0); transform-origin: left; }
        .dl2 { bottom: 25%; right: 0; width: 28%; animation: lineGrow 1.2s 1.5s cubic-bezier(0.16,1,0.3,1) forwards; transform: scaleX(0); transform-origin: right; }
        .dl3 { top: 45%; left: 10%; width: 20%; animation: lineGrow 1.2s 1.8s cubic-bezier(0.16,1,0.3,1) forwards; transform: scaleX(0); transform-origin: left; }

        /* ─── SECTIONS ─── */
        section { position: relative; }
        .section-wrap { max-width: 1320px; margin: 0 auto; padding: 0 32px; }
        .section-header { display: flex; flex-direction: column; gap: 24px; margin-bottom: 80px; }
        .section-label {
          font-size: 11px; letter-spacing: 0.35em; text-transform: uppercase;
          color: var(--text-muted); font-weight: 500; display: inline-flex;
          align-items: center; gap: 12px; margin-bottom: 16px;
        }
        .section-label::before {
          content: ''; width: 24px; height: 1px;
          background: linear-gradient(90deg, rgba(120,100,255,0.4), transparent);
        }
        .section-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700; letter-spacing: -0.03em;
        }
        .section-desc { max-width: 420px; color: var(--text-dim); line-height: 1.8; font-weight: 300; }
        .divider {
          width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border) 20%, var(--border) 80%, transparent);
        }

        /* ─── SERVICES ─── */
        .services-grid { display: grid; grid-template-columns: 1fr; gap: 1px; background: var(--border); }
        .service-card {
          position: relative; padding: 52px; background: var(--bg);
          transition: all 0.6s cubic-bezier(0.16,1,0.3,1); overflow: hidden;
        }
        .service-card::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 80% 20%, rgba(120,100,255,0.04), transparent 60%);
          opacity: 0; transition: opacity 0.6s;
        }
        .service-card:hover::after { opacity: 1; }
        .service-card:hover { background: var(--surface); }
        .service-card .corner {
          position: absolute; top: 0; right: 0; width: 72px; height: 72px;
          border-top: 1px solid var(--border); border-right: 1px solid var(--border);
          transition: all 0.6s;
        }
        .service-card:hover .corner { border-color: rgba(120,100,255,0.2); width: 96px; height: 96px; }
        .service-icon { margin-bottom: 20px; opacity: 0.6; transition: opacity 0.4s; }
        .service-card:hover .service-icon { opacity: 1; }
        .service-num {
          font-size: 11px; font-family: var(--font-body); color: var(--text-muted);
          letter-spacing: 0.15em; margin-bottom: 24px; font-weight: 500;
        }
        .service-card h3 {
          font-family: var(--font-display); font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700; color: #fff; margin-bottom: 16px; letter-spacing: -0.02em;
        }
        .service-card p { color: var(--text-dim); line-height: 1.8; margin-bottom: 32px; max-width: 420px; font-weight: 300; }
        .tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag {
          padding: 5px 14px; font-size: 10px; letter-spacing: 0.15em;
          text-transform: uppercase; color: var(--text-muted);
          border: 1px solid var(--border); font-weight: 500;
          transition: all 0.4s;
        }
        .service-card:hover .tag { border-color: var(--border-hi); color: var(--text-dim); }
        .service-arrow {
          position: absolute; bottom: 52px; right: 52px;
          opacity: 0; transition: all 0.5s; transform: translate(8px, 8px); color: var(--text-muted);
        }
        .service-card:hover .service-arrow { opacity: 1; transform: translate(0,0); }

        /* ─── PROJECTS ─── */
        .projects-list { display: flex; flex-direction: column; gap: 40px; }
        .project-card {
          position: relative; overflow: hidden; background: var(--surface);
          border: 1px solid var(--border); border-radius: 20px;
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer;
        }
        .project-card:hover {
          border-color: var(--border-hi);
          transform: translateY(-6px);
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5), 0 0 60px rgba(120,100,255,0.04);
        }
        .project-visual {
          position: relative; height: clamp(260px, 40vw, 520px);
          overflow: hidden; transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .project-card:hover .project-visual { transform: scale(1.03); }
        .project-visual::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(2,2,4,0.95) 100%);
          pointer-events: none;
        }
        .project-cat {
          position: absolute; top: 24px; left: 24px; z-index: 2;
          padding: 7px 14px; font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; font-weight: 500; color: var(--text-dim);
          background: rgba(2,2,4,0.6); backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.04); border-radius: 4px;
        }
        .project-metric { position: absolute; top: 24px; right: 24px; z-index: 2; text-align: right; }
        .project-metric .val {
          display: block; font-family: var(--font-display);
          font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
        }
        .project-metric .lbl { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-dim); }
        .project-info { position: relative; z-index: 2; padding: 36px; margin-top: -90px; }
        .project-info h3 {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 2.75rem);
          font-weight: 700; color: #fff; margin-bottom: 16px; letter-spacing: -0.02em;
        }
        .project-info p { color: var(--text-dim); line-height: 1.8; max-width: 640px; margin-bottom: 32px; font-weight: 300; }
        .project-footer { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
        .tech-tag {
          padding: 5px 14px; font-size: 10px; letter-spacing: 0.12em;
          font-weight: 500; color: var(--text-muted);
          border: 1px solid var(--border); transition: all 0.5s;
        }
        .project-card:hover .tech-tag { border-color: var(--border-hi); }
        .case-link {
          margin-left: auto; font-size: 10px; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--text-muted); font-weight: 500;
          display: flex; align-items: center; gap: 8px; transition: all 0.5s;
        }
        .project-card:hover .case-link { color: #fff; }

        .shapes { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .shape-box { position: relative; width: clamp(200px,30vw,400px); height: clamp(200px,30vw,400px); }
        .shape-box > div { transition: transform 0.8s cubic-bezier(0.16,1,0.3,1); }
        .shape-orbit { position: absolute; animation: rotateOrbit 40s linear infinite; }
        .shape-dot { position: absolute; animation: pulse 3s ease-in-out infinite; }

        /* ─── MARQUEE ─── */
        .marquee-wrap {
          overflow: hidden; padding: 88px 0;
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          position: relative;
        }
        .marquee-wrap::before, .marquee-wrap::after {
          content: ''; position: absolute; top: 0; bottom: 0; width: 120px; z-index: 2; pointer-events: none;
        }
        .marquee-wrap::before { left: 0; background: linear-gradient(90deg, var(--bg), transparent); }
        .marquee-wrap::after { right: 0; background: linear-gradient(270deg, var(--bg), transparent); }
        .marquee-track { display: flex; animation: marquee 35s linear infinite; width: max-content; }
        .marquee-track:hover { animation-play-state: paused; }
        .stat-item { display: flex; align-items: center; gap: 24px; white-space: nowrap; padding: 0 40px; }
        .stat-val {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3.25rem);
          font-weight: 700; color: #fff; font-variant-numeric: tabular-nums;
        }
        .stat-lbl { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-muted); font-weight: 500; }
        .stat-dot { color: var(--border); font-size: 24px; }

        /* ─── ABOUT ─── */
        .about-grid { display: grid; grid-template-columns: 1fr; gap: 64px; align-items: center; }
        .about-visual { position: relative; aspect-ratio: 1; max-width: 500px; margin: 0 auto; }
        .about-frame { position: absolute; inset: 0; border: 1px solid var(--border); transform: rotate(3deg); transition: all 0.6s; }
        .about-visual:hover .about-frame { transform: rotate(1deg); border-color: var(--border-hi); }
        .about-frame-inner { position: absolute; inset: 16px; border: 1px solid rgba(120,100,255,0.05); transform: rotate(-2deg); }
        .about-frame-bg {
          position: absolute; inset: 32px; background: var(--surface);
          background-image: radial-gradient(circle at 50% 50%, rgba(120,100,255,0.03), transparent);
        }
        .about-logo { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 10; }
        .about-logo-img { opacity: 0.7; transition: all 0.6s; filter: drop-shadow(0 0 30px rgba(120,100,255,0.1)); }
        .about-visual:hover .about-logo-img { opacity: 1; filter: drop-shadow(0 0 50px rgba(120,100,255,0.15)); transform: scale(1.05); }
        .about-corner-tl { position: absolute; top: -12px; left: -12px; width: 28px; height: 28px; border-top: 1px solid rgba(120,100,255,0.2); border-left: 1px solid rgba(120,100,255,0.2); }
        .about-corner-br { position: absolute; bottom: -12px; right: -12px; width: 28px; height: 28px; border-bottom: 1px solid rgba(120,100,255,0.2); border-right: 1px solid rgba(120,100,255,0.2); }
        .about-text h2 {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 700; letter-spacing: -0.03em; margin-bottom: 36px;
        }
        .about-text .lead { color: var(--text-dim); line-height: 1.8; margin-bottom: 24px; font-size: clamp(1rem, 1.5vw, 1.125rem); font-weight: 300; }
        .about-text .body { color: var(--text-muted); line-height: 1.8; margin-bottom: 44px; font-weight: 300; }
        .btn-outline {
          display: inline-flex; align-items: center; gap: 14px;
          padding: 14px 28px; border: 1px solid var(--border-hi);
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #fff; text-decoration: none; transition: all 0.4s;
          font-family: var(--font-body); font-weight: 500;
          position: relative; overflow: hidden;
        }
        .btn-outline::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(120,100,255,0.08), transparent);
          transform: translateX(-100%); transition: transform 0.6s;
        }
        .btn-outline:hover::before { transform: translateX(100%); }
        .btn-outline:hover { background: #fff; color: var(--bg); box-shadow: 0 0 30px rgba(255,255,255,0.08); }

        /* ─── CTA ─── */
        .cta { padding: 140px 0; overflow: hidden; position: relative; text-align: center; }
        .cta-glow {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: 900px; height: 900px; background: rgba(120,100,255,0.025);
          border-radius: 50%; filter: blur(120px); animation: breathe 8s ease-in-out infinite;
        }
        .cta-ring {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: 600px; height: 600px; border: 1px solid var(--border);
          border-radius: 50%; animation: rotateOrbit 60s linear infinite;
        }
        .cta-ring::after {
          content: ''; position: absolute; top: -4px; left: 50%;
          width: 8px; height: 8px; background: rgba(120,100,255,0.3);
          border-radius: 50%; box-shadow: 0 0 15px rgba(120,100,255,0.3);
        }
        .cta-inner { position: relative; z-index: 10; max-width: 800px; margin: 0 auto; padding: 0 32px; }
        .cta h2 {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 800; letter-spacing: -0.03em; margin-bottom: 32px;
        }
        .cta p { color: var(--text-dim); font-size: clamp(1rem, 2vw, 1.2rem); line-height: 1.8; max-width: 540px; margin: 0 auto 52px; font-weight: 300; }
        .cta-btns { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 16px; }

        /* ─── FOOTER ─── */
        footer { border-top: 1px solid var(--border); padding: 72px 0; }
        .footer-grid { display: grid; grid-template-columns: 1fr; gap: 48px; margin-bottom: 64px; }
        .footer-brand p { color: var(--text-muted); line-height: 1.8; max-width: 360px; font-size: 13px; margin-top: 24px; font-weight: 300; }
        .footer-col h4 {
          font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
          color: var(--text-muted); font-weight: 500; margin-bottom: 24px;
        }
        .footer-col a { display: block; font-size: 13px; color: var(--text-dim); text-decoration: none; margin-bottom: 14px; transition: all 0.3s; font-weight: 300; }
        .footer-col a:hover { color: #fff; transform: translateX(4px); }
        .footer-bottom {
          padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.03);
          display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;
        }
        .footer-bottom span { font-size: 11px; color: var(--text-muted); letter-spacing: 0.05em; }
        .footer-bottom a { font-size: 11px; color: var(--text-muted); text-decoration: none; transition: color 0.3s; }
        .footer-bottom a:hover { color: var(--text-dim); }

        /* Arrow */
        .arrow-icon { width: 16px; height: 16px; transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
        .btn-primary:hover .arrow-icon, .btn-outline:hover .arrow-icon, .project-card:hover .case-link .arrow-icon { transform: translateX(6px); }

        /* ─── RESPONSIVE ─── */
        @media (min-width: 768px) {
          .services-grid { grid-template-columns: 1fr 1fr; }
          .footer-grid { grid-template-columns: 2fr 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .section-header { flex-direction: row; align-items: flex-end; justify-content: space-between; }
          .stat-item { padding: 0 52px; }
          .about-grid { grid-template-columns: 1fr 1fr; gap: 100px; }
          .project-info { padding: 52px; margin-top: -100px; }
        }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .mobile-menu-btn { display: flex; }
          .glow1, .glow2, .glow3 { display: none; }
          .project-info { padding: 24px; margin-top: -60px; }
          .cta-ring { display: none; }
          .dl3 { display: none; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none; }
          .mobile-menu { display: none; }
        }
      `}</style>

      <div ref={pageRef}>
        {/* Loader */}
        <div className={`page-loader ${loaded ? "done" : ""}`}>
          <div className="loader-bar" />
        </div>

        {/* Overlays */}
        <div className="noise" />
        <div className="scanlines" />

        {/* Mobile menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Get in Touch</a>
        </div>

        {/* NAV */}
        <nav className={navScrolled ? "scrolled" : ""}>
          <div className="nav-inner">
            <a href="#" className="nav-logo">
              <Image src="/logo.png" alt="BRRICS" width={80} height={80} style={{ objectFit: "contain" }} />
              {/* <span className="logo-text">Brrics</span> */}
            </a>
            <div className="nav-links">
              <a href="#services">Services</a>
              <a href="#projects">Projects</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#contact" className="nav-cta">Get in Touch</a>
            </div>
            <button
              className={`mobile-menu-btn ${mobileMenuOpen ? "open" : ""}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero" ref={heroInView.ref}>
          <div className="grid-bg" />
          <div className="glow1" style={{ transform: `translate(${mouse.x * 20}px, ${mouse.y * 20}px)` }} />
          <div className="glow2" style={{ transform: `translate(${mouse.x * -15}px, ${mouse.y * -15}px)` }} />
          <div className="glow3" style={{ transform: `translate(${mouse.x * 10}px, ${mouse.y * 10}px)` }} />
          <div className="deco-line dl1" />
          <div className="deco-line dl2" />
          <div className="deco-line dl3" />

          <div className="hero-inner">
            <div className="pill reveal">
              <span className="pill-dot" />
              <span className="pill-text">Digital Agency — Est. 2024</span>
            </div>
            <h1 className="reveal d1">
              <span className="tc hero-scramble">{heroLine1 || "\u00A0"}</span>
              <br />
              <span className="tc hero-scramble" style={{ position: "relative", display: "inline-block" }}>
                {heroLine2 || "\u00A0"}
                <svg style={{ position: "absolute", bottom: -10, left: 0, width: "100%" }} viewBox="0 0 300 12" fill="none">
                  <path d="M2 8C50 3 100 2 150 5C200 8 250 4 298 6" stroke="rgba(120,100,255,0.2)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="reveal d3">
              Strategy. Design. Engineering.
              <br />
              We transform ambitious ideas into extraordinary digital products.
            </p>
            <div className="hero-btns reveal d4">
              <a href="#projects" className="btn-primary">
                View Our Work <ArrowRight />
              </a>
              <a href="#contact" className="btn-secondary">Start a Project</a>
            </div>
          </div>

          <div className="scroll-ind reveal d7">
            <span>Scroll</span>
            <div className="scroll-line" />
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" style={{ padding: "140px 0" }}>
          <div className="section-wrap">
            <div className="section-header">
              <div>
                <span className="section-label reveal">What We Do</span>
                <h2 className="section-title tc reveal d1">Services</h2>
              </div>
              <p className="section-desc reveal d2">
                End-to-end digital capabilities. From first concept to final deployment, we cover every layer of the stack.
              </p>
            </div>
            <div className="services-grid">
              {services.map((s, i) => (
                <div key={s.num} className={`service-card reveal d${i + 2}`}>
                  <div className="corner" />
                  <div className="service-icon">{s.icon}</div>
                  <div className="service-num">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <div className="tags">
                    {s.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <div className="service-arrow"><ArrowUpRight /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* PROJECTS */}
        <section id="projects" style={{ padding: "140px 0" }}>
          <div className="section-wrap">
            <div className="section-header">
              <div>
                <span className="section-label reveal">Selected Work</span>
                <h2 className="section-title tc reveal d1">Projects</h2>
              </div>
              <p className="section-desc reveal d2">
                Complex problems, elegant solutions. Here are some of the projects we&apos;re most proud of.
              </p>
            </div>
            <div className="projects-list">
              {projects.map((p, i) => (
                <div key={p.title} className={`project-card glow-border reveal d${i + 2}`}>
                  <div className="project-visual" style={{ background: p.gradient }}>
                    <ProjectShapes color={p.shapeColor} type={p.shapes} />
                    <div className="project-cat">{p.cat}</div>
                    <div className="project-metric">
                      <span className="val">{p.metricVal}</span>
                      <span className="lbl">{p.metricLbl}</span>
                    </div>
                  </div>
                  <div className="project-info">
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                    <div className="project-footer">
                      {p.techs.map((t) => <span key={t} className="tech-tag">{t}</span>)}
                      <span className="case-link">View Case Study <ArrowRight /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS MARQUEE */}
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[0, 1].map((dup) => (
              <div key={dup} style={{ display: "flex", alignItems: "center" }}>
                {statsData.map((s) => (
                  <StatCounter key={`${dup}-${s.lbl}`} target={s.val} suffix={s.suffix} label={s.lbl} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <section id="about" style={{ padding: "140px 0" }}>
          <div className="section-wrap">
            <div className="about-grid">
              <div className="about-visual reveal d2">
                <div className="about-frame">
                  <div className="about-frame-inner" />
                  <div className="about-frame-bg" />
                </div>
                <div className="about-logo">
                  <Image
                    src="/logo.png"
                    alt="BRRICS"
                    width={200}
                    height={200}
                    className="about-logo-img"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="about-corner-tl" />
                <div className="about-corner-br" />
              </div>
              <div className="about-text">
                <span className="section-label reveal">Who We Are</span>
                <h2 className="reveal d1">
                  <span className="tc">Obsessed with<br />craft &amp; impact</span>
                </h2>
                <p className="lead reveal d2">
                  BRRICS is a collective of strategists, designers, and engineers united by a single belief: technology should amplify human potential, not complicate it.
                </p>
                <p className="body reveal d3">
                  We don&apos;t just build products — we architect experiences that define industries. From stealth startups to Fortune 500s, our work speaks for itself.
                </p>
                <a href="#contact" className="btn-outline reveal d4">Learn More <ArrowRight /></a>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* CTA */}
        <section id="contact" className="cta">
          <div className="cta-glow" />
          <div className="cta-ring" />
          <div className="cta-inner">
            <span className="section-label reveal">Ready to start?</span>
            <h2 className="reveal d1">
              <span className="tc">Let&apos;s build<br />something great</span>
            </h2>
            <p className="reveal d2">
              Got an idea that needs a world-class team? We&apos;re selective about the projects we take on — but if it&apos;s ambitious, we&apos;re in.
            </p>
            <div className="cta-btns reveal d3">
              <a href="mailto:hello@brrics.com" className="btn-primary">hello@brrics.com <ArrowRight /></a>
              <a href="#" className="btn-secondary">Book a Call</a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="section-wrap">
            <div className="footer-grid">
              <div className="footer-brand">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Image src="/logo.png" alt="BRRICS" width={200} height={200} style={{ objectFit: "contain" }} />
                  <span className="logo-text" style={{ fontSize: 16 }}>Brrics</span>
                </div>
                <p>A futuristic digital agency crafting bold digital experiences. Strategy. Design. Engineering. Scale.</p>
              </div>
              <div className="footer-col">
                <h4>Navigation</h4>
                <a href="#services">Services</a>
                <a href="#projects">Projects</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-col">
                <h4>Connect</h4>
                <a href="#">Twitter / X</a>
                <a href="#">LinkedIn</a>
                <a href="#">Dribbble</a>
                <a href="#">GitHub</a>
              </div>
            </div>
            <div className="footer-bottom">
              <span>&copy; 2024 BRRICS. All rights reserved.</span>
              <div style={{ display: "flex", gap: 24 }}>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}