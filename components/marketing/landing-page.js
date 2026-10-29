import Link from 'next/link';
import { ArrowRight, BellRing, Check, ChevronRight, CircleCheck, Layers3, Menu, Play, Sparkles, Target, X } from 'lucide-react';
import { useState } from 'react';

const benefits = [
  { icon: Layers3, title: 'One calm workspace', text: 'Bring Gmail, shared links, browser finds, and manual applications into one clear view.' },
  { icon: Target, title: 'Know what comes next', text: 'Stay ahead of follow-ups, interviews, and the small actions that move a search forward.' },
  { icon: BellRing, title: 'Never lose the thread', text: 'Keep notes, contacts, job links, and application status together from first look to offer.' }
];

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfcff] text-[#182338]">
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#4168ee] text-white shadow-[0_8px_20px_rgba(65,104,238,.25)]">◈</span>
          orbit
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
          <a href="#how-it-works" className="transition hover:text-[#4168ee]">How it works</a>
          <a href="#features" className="transition hover:text-[#4168ee]">Features</a>
          <a href="#why-orbit" className="transition hover:text-[#4168ee]">Why Orbit</a>
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <Link href="/signup" className="text-sm font-semibold text-slate-600 transition hover:text-[#4168ee]">Sign in</Link>
          <Link href="/signup" className="rounded-lg bg-[#4168ee] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(65,104,238,.18)] transition hover:bg-blue-700">Get started <ArrowRight className="ml-1 inline" size={15} /></Link>
        </div>
        <button className="text-slate-500 md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
        {menuOpen && <div className="absolute left-6 right-6 top-20 rounded-xl border border-slate-200 bg-white p-4 shadow-xl md:hidden"><div className="grid gap-3 text-sm text-slate-600"><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a><a href="#features" onClick={() => setMenuOpen(false)}>Features</a><Link href="/signup" className="font-bold text-[#4168ee]">Get started <ArrowRight className="inline" size={14} /></Link></div></div>}
      </header>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-16 lg:grid-cols-[.95fr_1.05fr] lg:px-10 lg:pb-32 lg:pt-24">
        <div className="pointer-events-none absolute -left-36 top-8 h-96 w-96 rounded-full bg-[#dfe8ff] opacity-60 blur-3xl" />
        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dce5ff] bg-white px-3 py-1.5 text-xs font-bold text-[#5574dc] shadow-sm"><Sparkles size={14} /> A better way to job hunt</div>
          <h1 className="max-w-xl text-5xl font-bold leading-[1.05] tracking-[-2.8px] sm:text-6xl">Make every application <span className="font-display font-semibold italic text-[#4168ee]">count.</span></h1>
          <p className="mt-7 max-w-lg text-lg leading-8 text-slate-500">Orbit gives your job search a home. Capture every opportunity, stay on top of what matters, and move closer to the right offer.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#4168ee] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(65,104,238,.22)] transition hover:-translate-y-0.5 hover:bg-blue-700">Start for free <ArrowRight size={16} /></Link><a href="#how-it-works" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-600 transition hover:border-[#b8c7fb]"><Play size={14} className="fill-current text-[#4168ee]" /> See how it works</a></div>
          <div className="mt-8 flex items-center gap-5 text-xs text-slate-400"><span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Free to get started</span><span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Google sign-up</span></div>
        </div>
        <HeroPreview />
      </section>

      <section id="features" className="border-y border-slate-100 bg-white py-20"><div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="mb-12 max-w-xl"><p className="mb-3 text-xs font-bold uppercase tracking-[1.4px] text-[#5574dc]">Built for momentum</p><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Your search deserves more than a spreadsheet.</h2></div><div className="grid gap-10 md:grid-cols-3">{benefits.map(({ icon: Icon, title, text }) => <div key={title}><div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-[#4168ee]"><Icon size={20} /></div><h3 className="text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{text}</p></div>)}</div></div></section>

      <section id="how-it-works" className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-10 lg:py-28"><div><p className="mb-3 text-xs font-bold uppercase tracking-[1.4px] text-[#5574dc]">A simpler rhythm</p><h2 className="max-w-md text-3xl font-bold tracking-tight sm:text-4xl">Less admin. More time for the work that gets you hired.</h2><p className="mt-5 max-w-md text-sm leading-7 text-slate-500">Orbit turns scattered job-search details into a steady, visible rhythm so you can focus on the conversations that matter.</p></div><div className="grid gap-3">{['Capture opportunities wherever you find them', 'Keep every detail in one focused workspace', 'Move forward with timely follow-ups'].map((step, index) => <div key={step} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-50 text-sm font-bold text-[#4168ee]">0{index + 1}</span><span className="text-sm font-semibold text-slate-700">{step}</span><ChevronRight className="ml-auto text-slate-300" size={17} /></div>)}</div></section>

      <section id="why-orbit" className="mx-6 mb-10 overflow-hidden rounded-2xl bg-[#182338] px-7 py-12 text-white sm:px-12 lg:mx-auto lg:max-w-7xl lg:py-16"><div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><p className="mb-3 text-xs font-bold uppercase tracking-[1.4px] text-[#9eb2ff]">Your next chapter starts here</p><h2 className="max-w-lg text-3xl font-bold tracking-tight">Give your job search the attention it deserves.</h2></div><Link href="/signup" className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#4168ee] transition hover:bg-indigo-50">Create your workspace <ArrowRight size={16} /></Link></div></section>
      <footer className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 text-xs text-slate-400 lg:px-10"><span>© 2026 Orbit</span><span>Made for people building what comes next.</span></footer>
    </main>
  );
}

function HeroPreview() {
  return <div className="relative mx-auto w-full max-w-[560px]"><div className="absolute -right-7 -top-8 h-24 w-24 rounded-full bg-[#dce5ff] blur-2xl" /><div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_30px_70px_rgba(45,64,110,.14)] sm:p-5"><div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4"><div className="flex items-center gap-2 text-sm font-bold"><span className="grid h-6 w-6 place-items-center rounded-md bg-[#4168ee] text-[10px] text-white">◈</span> orbit</div><span className="h-7 w-7 rounded-full bg-slate-800" /></div><div className="mb-5 flex items-end justify-between"><div><p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Your overview</p><p className="mt-1 text-xl font-bold">Good morning, Alex.</p></div><span className="rounded-md bg-indigo-50 px-2 py-1 text-[9px] font-bold text-[#4168ee]">This week</span></div><div className="mb-5 grid grid-cols-3 gap-2"><MiniStat value="24" label="Applications" /><MiniStat value="08" label="Active" /><MiniStat value="03" label="Interviews" /></div><div className="rounded-xl border border-slate-100 p-3"><div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-bold">Recent applications</span><span className="text-[9px] text-[#4168ee]">View all</span></div>{['Northstar Labs', 'Acme Technologies', 'CloudPeak'].map((company, index) => <div key={company} className="flex items-center gap-2 border-t border-slate-100 py-2.5"><span className="grid h-6 w-6 place-items-center rounded-md bg-indigo-50 text-[8px] font-bold text-[#4168ee]">{company.slice(0, 2).toUpperCase()}</span><span className="flex-1 text-[10px] font-semibold">{company}</span><span className={`rounded px-1.5 py-1 text-[8px] font-bold ${index === 0 ? 'bg-orange-50 text-orange-500' : index === 1 ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}`}>{['Interview', 'Applied', 'Offer'][index]}</span></div>)}</div></div></div>;
}

function MiniStat({ value, label }) {
  return <div className="rounded-lg bg-slate-50 p-3"><strong className="block text-lg">{value}</strong><span className="text-[9px] text-slate-400">{label}</span></div>;
}
