"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ─── Scroll Reveal Hook ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Magnetic Button Component ─── */
function MagneticButton({ children, href, className = "" }: { children: React.ReactNode; href?: string; className?: string }) {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  };

  const handleMouseLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = "translate(0, 0)";
  };

  return (
    <a
      ref={btnRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block transition-transform duration-300 ${className}`}
    >
      {children}
    </a>
  );
}

/* ─── Animated Counter ─── */
function Counter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Page ─── */
export default function Home() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hero = useReveal(0.1);
  const services = useReveal(0.1);
  const projects = useReveal(0.1);
  const stats = useReveal(0.1);
  const about = useReveal(0.1);
  const cta = useReveal(0.1);

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const servicesList = [
    {
      num: "01",
      title: "Digital Strategy",
      desc: "Data-driven roadmaps that align technology with business goals. We decode market complexity into actionable digital blueprints.",
      tags: ["Research", "Analytics", "Roadmapping"],
    },
    {
      num: "02",
      title: "Design & Branding",
      desc: "Visual identities that cut through noise. From brand systems to immersive interfaces, every pixel serves a purpose.",
      tags: ["UI/UX", "Brand Identity", "Motion Design"],
    },
    {
      num: "03",
      title: "Development",
      desc: "Engineered for scale. We build performant, resilient applications using modern stacks and battle-tested architecture.",
      tags: ["Web Apps", "Mobile", "Cloud Infrastructure"],
    },
    {
      num: "04",
      title: "Growth & Launch",
      desc: "From MVP to market dominance. We orchestrate launches, optimize funnels, and accelerate traction with precision.",
      tags: ["SEO", "Performance", "Launch Strategy"],
    },
  ];

  const projectsList = [
    {
      title: "Neural Commerce Platform",
      category: "E-Commerce · AI Integration",
      desc: "A next-gen e-commerce ecosystem powered by real-time AI personalization. Predictive inventory, dynamic pricing, and a conversational shopping interface that boosted conversion by 340%.",
      tech: ["Next.js", "Python", "TensorFlow", "AWS"],
      gradient: "from-violet-900/30 via-purple-900/20 to-transparent",
      metric: "340%",
      metricLabel: "Conversion Uplift",
    },
    {
      title: "Orbital — Fintech Dashboard",
      category: "Finance · Data Visualization",
      desc: "Real-time financial analytics platform processing 2M+ transactions daily. Interactive 3D data visualizations, custom charting engine, and sub-100ms query response times.",
      tech: ["React", "Go", "PostgreSQL", "WebGL"],
      gradient: "from-cyan-900/30 via-blue-900/20 to-transparent",
      metric: "2M+",
      metricLabel: "Daily Transactions",
    },
    {
      title: "Meridian Health System",
      category: "Healthcare · IoT Platform",
      desc: "Connected health monitoring platform integrating 50K+ IoT devices. HIPAA-compliant infrastructure with real-time patient data streams and predictive alert systems.",
      tech: ["TypeScript", "Rust", "MQTT", "GCP"],
      gradient: "from-emerald-900/30 via-green-900/20 to-transparent",
      metric: "50K+",
      metricLabel: "Connected Devices",
    },
  ];

  return (
    <>
      {/* ─── NAVIGATION ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled ? "nav-blur py-4" : "py-6 bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="BRRICS"
              width={40}
              height={40}
              className="transition-transform duration-500 group-hover:scale-110"
            />
            <span className="text-lg font-medium tracking-[0.3em] text-white uppercase hidden sm:block">
              Brrics
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm tracking-widest uppercase text-[#888] hover:text-white transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <MagneticButton
              href="#contact"
              className="ml-4 px-6 py-2.5 border border-[#333] text-sm tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              Get in Touch
            </MagneticButton>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-6 flex flex-col gap-4 bg-[#030303]/95 backdrop-blur-xl border-t border-[#1a1a1a]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-widest uppercase text-[#888] hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section ref={hero.ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="grid-bg" />
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />

        {/* Geometric lines */}
        <div className="absolute top-[20%] left-0 w-[30%] h-px bg-gradient-to-r from-transparent via-white/5 to-transparent animate-line-grow delay-1000" />
        <div className="absolute bottom-[25%] right-0 w-[25%] h-px bg-gradient-to-l from-transparent via-white/5 to-transparent animate-line-grow delay-1200" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          {/* Tagline pill */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 border border-[#222] rounded-full mb-10 ${
              hero.visible ? "animate-fade-up" : "opacity-0"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs tracking-[0.25em] uppercase text-[#888] font-mono">
              Digital Agency — Est. 2024
            </span>
          </div>

          {/* Main heading */}
          <h1
            className={`text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-semibold leading-[0.95] tracking-tight ${
              hero.visible ? "animate-fade-up delay-200" : "opacity-0"
            }`}
          >
            <span className="text-chrome">We Build</span>
            <br />
            <span className="text-chrome">Digital</span>{" "}
            <span className="relative inline-block">
              <span className="text-chrome">Futures</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8C50 3 100 2 150 5C200 8 250 4 298 6"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subtext */}
          <p
            className={`mt-8 max-w-xl mx-auto text-lg sm:text-xl text-[#777] leading-relaxed ${
              hero.visible ? "animate-fade-up delay-400" : "opacity-0"
            }`}
          >
            Strategy. Design. Engineering.
            <br className="hidden sm:block" />
            We transform ambitious ideas into extraordinary digital products.
          </p>

          {/* CTAs */}
          <div
            className={`mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 ${
              hero.visible ? "animate-fade-up delay-600" : "opacity-0"
            }`}
          >
            <MagneticButton
              href="#projects"
              className="group px-8 py-4 bg-white text-black text-sm tracking-widest uppercase font-medium hover:bg-[#e0e0e0] transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                View Our Work
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </MagneticButton>
            <MagneticButton
              href="#contact"
              className="px-8 py-4 border border-[#333] text-sm tracking-widest uppercase text-[#ccc] hover:border-[#666] hover:text-white transition-all duration-300"
            >
              Start a Project
            </MagneticButton>
          </div>

          {/* Scroll indicator */}
          <div
            className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 ${
              hero.visible ? "animate-fade-in delay-1500" : "opacity-0"
            }`}
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#555]">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-[#555] to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" ref={services.ref} className="relative py-32 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20">
            <div>
              <span
                className={`text-xs tracking-[0.3em] uppercase text-[#555] font-mono block mb-4 ${
                  services.visible ? "animate-fade-up" : "opacity-0"
                }`}
              >
                What We Do
              </span>
              <h2
                className={`text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-chrome ${
                  services.visible ? "animate-fade-up delay-100" : "opacity-0"
                }`}
              >
                Services
              </h2>
            </div>
            <p
              className={`max-w-md text-[#666] leading-relaxed ${
                services.visible ? "animate-fade-up delay-200" : "opacity-0"
              }`}
            >
              End-to-end digital capabilities. From first concept to final
              deployment, we cover every layer of the stack.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a]">
            {servicesList.map((s, i) => (
              <div
                key={s.num}
                className={`group relative p-8 lg:p-12 bg-[#030303] hover:bg-[#080808] transition-all duration-500 ${
                  services.visible ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${200 + i * 100}ms` }}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-[#1a1a1a] group-hover:border-[#333] transition-colors duration-500" />

                <span className="block text-xs font-mono text-[#444] mb-6 tracking-wider">
                  {s.num}
                </span>
                <h3 className="text-2xl lg:text-3xl font-semibold text-white mb-4 tracking-tight">
                  {s.title}
                </h3>
                <p className="text-[#666] leading-relaxed mb-8 max-w-md">
                  {s.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs tracking-wider uppercase text-[#555] border border-[#1a1a1a] font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Hover arrow */}
                <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                  <svg className="w-6 h-6 text-[#444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="section-divider" />

      {/* ─── PROJECTS ─── */}
      <section id="projects" ref={projects.ref} className="relative py-32 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-20">
            <div>
              <span
                className={`text-xs tracking-[0.3em] uppercase text-[#555] font-mono block mb-4 ${
                  projects.visible ? "animate-fade-up" : "opacity-0"
                }`}
              >
                Selected Work
              </span>
              <h2
                className={`text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-chrome ${
                  projects.visible ? "animate-fade-up delay-100" : "opacity-0"
                }`}
              >
                Projects
              </h2>
            </div>
            <p
              className={`max-w-md text-[#666] leading-relaxed ${
                projects.visible ? "animate-fade-up delay-200" : "opacity-0"
              }`}
            >
              Complex problems, elegant solutions. Here are some of the projects
              we&apos;re most proud of.
            </p>
          </div>

          {/* Projects list */}
          <div className="flex flex-col gap-8">
            {projectsList.map((p, i) => (
              <div
                key={p.title}
                className={`project-card group rounded-xl lg:rounded-2xl overflow-hidden ${
                  projects.visible ? "animate-fade-up" : "opacity-0"
                }`}
                style={{ animationDelay: `${300 + i * 150}ms` }}
              >
                {/* Gradient background for project visual */}
                <div className={`relative h-[300px] sm:h-[400px] lg:h-[500px] bg-gradient-to-br ${p.gradient} project-image`}>
                  {/* Abstract geometric shapes as project visuals */}
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    {i === 0 && (
                      <div className="relative w-64 h-64 lg:w-96 lg:h-96">
                        <div className="absolute inset-8 border border-purple-500/20 rounded-2xl rotate-12 group-hover:rotate-6 transition-transform duration-700" />
                        <div className="absolute inset-16 border border-purple-400/15 rounded-xl -rotate-6 group-hover:rotate-3 transition-transform duration-700" />
                        <div className="absolute inset-24 bg-purple-500/5 rounded-lg rotate-3 group-hover:-rotate-3 transition-transform duration-700" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-purple-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                      </div>
                    )}
                    {i === 1 && (
                      <div className="relative w-64 h-64 lg:w-96 lg:h-96">
                        <div className="absolute inset-0 border border-cyan-500/15 rounded-full group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-12 border border-cyan-400/10 rounded-full group-hover:scale-95 transition-transform duration-700" />
                        <div className="absolute inset-24 border border-cyan-300/10 rounded-full group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400/30 rounded-full" />
                        {/* Orbital dots */}
                        <div className="absolute top-4 left-1/2 w-2 h-2 bg-cyan-400/20 rounded-full" />
                        <div className="absolute bottom-8 right-12 w-2 h-2 bg-cyan-400/20 rounded-full" />
                        <div className="absolute top-1/3 left-8 w-1.5 h-1.5 bg-cyan-400/30 rounded-full" />
                      </div>
                    )}
                    {i === 2 && (
                      <div className="relative w-64 h-64 lg:w-96 lg:h-96">
                        <div className="absolute inset-4 border border-emerald-500/15 rotate-45 group-hover:rotate-[50deg] transition-transform duration-700" />
                        <div className="absolute inset-12 border border-emerald-400/10 rotate-12 group-hover:rotate-6 transition-transform duration-700" />
                        <div className="absolute inset-20 bg-emerald-500/5 rounded-sm -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                        <div className="absolute top-8 right-8 w-3 h-3 bg-emerald-400/20 rounded-full" />
                        <div className="absolute bottom-12 left-12 w-2 h-2 bg-emerald-400/30 rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Project category label */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="px-3 py-1.5 text-xs tracking-widest uppercase font-mono text-[#999] bg-black/50 backdrop-blur-sm border border-white/5">
                      {p.category}
                    </span>
                  </div>

                  {/* Key metric */}
                  <div className="absolute top-6 right-6 z-10 text-right">
                    <span className="block text-3xl lg:text-4xl font-semibold text-white/90">{p.metric}</span>
                    <span className="text-xs tracking-wider uppercase text-[#888]">{p.metricLabel}</span>
                  </div>
                </div>

                {/* Project info */}
                <div className="project-content p-8 lg:p-12 -mt-20 lg:-mt-24">
                  <h3 className="text-3xl lg:text-4xl font-semibold text-white mb-4 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-[#888] leading-relaxed max-w-2xl mb-8">
                    {p.desc}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 text-xs tracking-wider font-mono text-[#666] border border-[#222]"
                      >
                        {t}
                      </span>
                    ))}
                    <span className="ml-auto text-xs tracking-widest uppercase text-[#555] group-hover:text-white transition-colors duration-500 flex items-center gap-2">
                      View Case Study
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS MARQUEE ─── */}
      <section ref={stats.ref} className="relative py-20 overflow-hidden border-y border-[#1a1a1a]">
        <div className="flex">
          <div className="marquee-track">
            {[...Array(2)].map((_, rep) => (
              <div key={rep} className="flex items-center gap-16 lg:gap-24 px-8 lg:px-12">
                {[
                  { value: 50, suffix: "+", label: "Projects Delivered" },
                  { value: 98, suffix: "%", label: "Client Satisfaction" },
                  { value: 15, suffix: "+", label: "Industries Served" },
                  { value: 4, suffix: ".9", label: "Average Rating" },
                  { value: 30, suffix: "+", label: "Team Members" },
                  { value: 12, suffix: "+", label: "Countries Reached" },
                ].map((s) => (
                  <div key={`${rep}-${s.label}`} className="flex items-center gap-6 whitespace-nowrap">
                    <span className="text-4xl lg:text-5xl font-semibold text-white tabular-nums">
                      {stats.visible ? (
                        <Counter target={s.value} suffix={s.suffix} />
                      ) : (
                        `0${s.suffix}`
                      )}
                    </span>
                    <span className="text-xs tracking-[0.2em] uppercase text-[#555]">{s.label}</span>
                    <span className="text-[#222] text-2xl">•</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT TEASER ─── */}
      <section id="about" ref={about.ref} className="relative py-32 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left — visual */}
            <div
              className={`relative ${
                about.visible ? "animate-slide-left delay-200" : "opacity-0"
              }`}
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                {/* Abstract geometric composition */}
                <div className="absolute inset-0 border border-[#1a1a1a] rotate-3">
                  <div className="absolute inset-4 border border-[#151515] -rotate-2" />
                  <div className="absolute inset-8 bg-[#080808]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="BRRICS"
                    width={200}
                    height={200}
                    className="opacity-80 z-10"
                  />
                </div>
                {/* Corner accents */}
                <div className="absolute -top-3 -left-3 w-6 h-6 border-t border-l border-[#333]" />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r border-[#333]" />
              </div>
            </div>

            {/* Right — text */}
            <div>
              <span
                className={`text-xs tracking-[0.3em] uppercase text-[#555] font-mono block mb-4 ${
                  about.visible ? "animate-fade-up" : "opacity-0"
                }`}
              >
                Who We Are
              </span>
              <h2
                className={`text-4xl sm:text-5xl font-semibold tracking-tight text-chrome mb-8 ${
                  about.visible ? "animate-fade-up delay-100" : "opacity-0"
                }`}
              >
                Obsessed with
                <br />
                craft & impact
              </h2>
              <p
                className={`text-[#777] leading-relaxed mb-6 text-lg ${
                  about.visible ? "animate-fade-up delay-200" : "opacity-0"
                }`}
              >
                BRRICS is a collective of strategists, designers, and engineers
                united by a single belief: technology should amplify human
                potential, not complicate it.
              </p>
              <p
                className={`text-[#666] leading-relaxed mb-10 ${
                  about.visible ? "animate-fade-up delay-300" : "opacity-0"
                }`}
              >
                We don&apos;t just build products — we architect experiences that
                define industries. From stealth startups to Fortune 500s, our work
                speaks for itself.
              </p>
              <div
                className={`flex items-center gap-4 ${
                  about.visible ? "animate-fade-up delay-400" : "opacity-0"
                }`}
              >
                <MagneticButton
                  href="#contact"
                  className="group px-6 py-3 border border-[#333] text-sm tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-3"
                >
                  <span>Learn More</span>
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="section-divider" />

      {/* ─── CTA ─── */}
      <section id="contact" ref={cta.ref} className="relative py-32 lg:py-44 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <span
            className={`text-xs tracking-[0.3em] uppercase text-[#555] font-mono block mb-6 ${
              cta.visible ? "animate-fade-up" : "opacity-0"
            }`}
          >
            Ready to start?
          </span>
          <h2
            className={`text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-chrome mb-8 ${
              cta.visible ? "animate-fade-up delay-100" : "opacity-0"
            }`}
          >
            Let&apos;s build
            <br />
            something great
          </h2>
          <p
            className={`text-[#777] text-lg sm:text-xl leading-relaxed max-w-xl mx-auto mb-12 ${
              cta.visible ? "animate-fade-up delay-200" : "opacity-0"
            }`}
          >
            Got an idea that needs a world-class team? We&apos;re selective about the
            projects we take on — but if it&apos;s ambitious, we&apos;re in.
          </p>
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${
              cta.visible ? "animate-fade-up delay-300" : "opacity-0"
            }`}
          >
            <MagneticButton
              href="mailto:hello@brrics.com"
              className="group px-10 py-5 bg-white text-black text-sm tracking-widest uppercase font-medium hover:bg-[#e0e0e0] transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                hello@brrics.com
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </MagneticButton>
            <MagneticButton
              href="#"
              className="px-10 py-5 border border-[#333] text-sm tracking-widest uppercase text-[#ccc] hover:border-[#666] hover:text-white transition-all duration-300"
            >
              Book a Call
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#1a1a1a] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Image src="/logo.png" alt="BRRICS" width={36} height={36} />
                <span className="text-lg font-medium tracking-[0.3em] text-white uppercase">
                  Brrics
                </span>
              </div>
              <p className="text-[#555] leading-relaxed max-w-sm text-sm">
                A futuristic digital agency crafting bold digital experiences.
                Strategy. Design. Engineering. Scale.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-[#555] font-mono mb-6">
                Navigation
              </h4>
              <div className="flex flex-col gap-3">
                {["Services", "Projects", "About", "Contact"].map((l) => (
                  <a
                    key={l}
                    href={`#${l.toLowerCase()}`}
                    className="text-sm text-[#666] hover:text-white transition-colors duration-300"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase text-[#555] font-mono mb-6">
                Connect
              </h4>
              <div className="flex flex-col gap-3">
                {["Twitter / X", "LinkedIn", "Dribbble", "GitHub"].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="text-sm text-[#666] hover:text-white transition-colors duration-300"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-[#111] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#444] font-mono tracking-wider">
              &copy; 2024 BRRICS. All rights reserved.
            </span>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-[#444] hover:text-[#888] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-[#444] hover:text-[#888] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}