import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, BriefcaseBusiness, CalendarCheck2, ChartNoAxesColumnIncreasing, CircleX, Menu, Plus, Sparkles } from 'lucide-react';
import { clearAccessToken, getAccessToken, getApplications, getCurrentUser } from '../../lib/api';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Sidebar } from '../layout/sidebar';

const stages = ['saved', 'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn', 'hired', 'archived'];

function formatDate(value) {
  if (!value) return 'No date';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function CompanyMark({ company }) {
  return <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-[9px] font-bold text-brand">{company?.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase()}</span>;
}

export function OverviewPage() {
  const [applications, setApplications] = useState([]);
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const load = useCallback(async () => {
    try { setApplications((await getApplications()).data || []); setError(''); }
    catch (loadError) {
      if (loadError.status === 401) { clearAccessToken(); window.location.replace('/signup'); return; }
      setError('Could not load your overview. Check the backend connection.');
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function verify() {
      if (!getAccessToken()) { window.location.replace('/signup'); return; }
      try { await getCurrentUser(); if (active) { setAuthenticated(true); setChecking(false); load(); } }
      catch (authError) {
        if (authError.status === 401) { clearAccessToken(); window.location.replace('/signup'); return; }
        if (active) { setError('We could not verify your session.'); setChecking(false); }
      }
    }
    verify();
    return () => { active = false; };
  }, [load]);

  const counts = useMemo(() => Object.fromEntries(stages.map((stage) => [stage, applications.filter((item) => item.status === stage).length])), [applications]);
  const active = applications.filter((item) => !['rejected', 'withdrawn'].includes(item.status)).length;
  const recent = applications.slice(0, 5);
  const interviews = applications.filter((item) => item.status === 'interview').slice(0, 3);

  if (checking || !authenticated) return <div className="grid min-h-screen place-items-center bg-canvas text-md text-slate-500">Checking your secure workspace...</div>;

  return <div className="flex min-h-screen bg-canvas text-ink">
    <Sidebar total={applications.length} activeLabel="Overview" open={sidebarOpen} collapsed={sidebarCollapsed} onClose={() => setSidebarOpen(false)} onToggle={() => setSidebarCollapsed((value) => !value)} />
    <main className="min-w-0 flex-1">
      <header className="flex h-[58px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-7">
        <div className="flex items-center gap-3 text-xs text-slate-400"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={18} /></Button><span>Workspace</span><b className="font-normal text-slate-300">/</b><strong className="text-slate-700">Overview</strong></div>
        <div className="flex items-center gap-3"><Button variant="ghost" size="icon"><Bell size={16} /></Button><div className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-[9px] font-bold text-brand">AK</div></div>
      </header>
      <div className="  px-5 py-7 lg:px-7">
        <div className="mb-5 flex items-start justify-between"><div><h1 className="text-xl font-bold tracking-tight">Overview</h1><p className="mt-1 text-[10px] text-slate-400">A clear view of your search · Thursday, October 29</p></div>
        <Button size="sm"><Plus size={14} /> Add application</Button>
        </div>
        {error && <div className="mb-4 rounded-lg bg-rose-50 px-4 py-3 text-xs text-rose-600">{error}</div>}
        <div className="mb-4 grid grid-cols-2 gap-2.5 xl:grid-cols-5">
          <OverviewStat icon={BriefcaseBusiness} label="Total applications" value={applications.length} note="9 in the last 30 days" color="bg-blue-50 text-brand" />
          <OverviewStat icon={ChartNoAxesColumnIncreasing} label="Applied" value={counts.applied} note="Applications in progress" color="bg-indigo-50 text-brand" />
          <OverviewStat icon={CalendarCheck2} label="Interviews" value={counts.interview} note="Across your pipeline" color="bg-emerald-50 text-emerald-600" />
          <OverviewStat icon={Sparkles} label="Offers" value={counts.offer} note="A good problem to have" color="bg-emerald-50 text-emerald-600" />
          <OverviewStat icon={CircleX} label="Rejections" value={counts.rejected} note="Keep moving forward" color="bg-rose-50 text-rose-500" />
        </div>
        <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
          <Card className="p-3.5"><PanelTitle title="Recent applications" subtitle="Your latest opportunities" action="View all →" /><div className="mt-3">{recent.map((item) => <div key={item._id} className="flex items-center gap-2 border-b border-slate-100 py-2.5 last:border-0"><CompanyMark company={item.company} /><div className="min-w-0 flex-1"><strong className="block truncate text-[10px]">{item.company}</strong><span className="block truncate text-[9px] text-slate-400">{item.role}</span></div><span className="hidden text-[9px] text-slate-400 sm:block">{formatDate(item.appliedAt)}</span><span className="hidden text-[9px] text-slate-400 md:block">{item.source}</span><StatusPill status={item.status} /></div>)}</div></Card>
          <Card className="p-3.5"><PanelTitle title="Pipeline overview" subtitle={`${applications.length} opportunities by status`} action="Analytics" /><div className="mt-4 grid gap-2.5">{stages.slice(1, 7).map((stage) => <div key={stage} className="flex items-center gap-2 text-[9px] text-slate-400"><span className="w-16 capitalize">{stage}</span><div className="h-1 flex-1 rounded-full bg-slate-100"><div className="h-1 rounded-full bg-[#5b8dcc]" style={{ width: `${Math.min(100, Math.max(8, counts[stage] * 19))}%` }} /></div><b className="w-3 text-right text-slate-600">{counts[stage]}</b></div>)}</div><div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/60 p-3"><span className="block text-[9px] text-slate-500">Pipeline health</span><strong className="block text-sm">{applications.length ? Math.round((counts.interview / applications.length) * 100) : 0}%</strong><span className="text-[9px] text-slate-500">of saved opportunities reached interview</span></div></Card>
          <Card className="p-3.5 lg:col-span-1"><PanelTitle title="Applications over time" subtitle="Activity across recent weeks" /><div className="mt-5 flex h-28 items-end justify-between gap-2 border-b border-slate-200 px-2">{[1, 1, 1, 2, 2, 2, 1].map((value, index) => <div key={index} className="flex h-full flex-1 flex-col items-center justify-end gap-1"><span className="text-[8px] text-slate-400">{value}</span><div className={`w-full max-w-7 rounded-t-md ${index > 2 && index < 6 ? 'bg-[#5b8dcc]' : 'bg-blue-100'}`} style={{ height: `${value * 28}px` }} /><span className="text-[8px] text-slate-400">{['Sep 17', 'Sep 24', 'Oct 1', 'Oct 8', 'Oct 15', 'Oct 22', 'Oct 29'][index]}</span></div>)}</div></Card>
          <Card className="p-3.5"><PanelTitle title="Upcoming interviews" subtitle="Keep the next conversation close" action="All reminders" /><div className="mt-3">{(interviews.length ? interviews : recent.slice(0, 3)).map((item, index) => <div key={item._id} className="flex items-center gap-2 border-t border-slate-100 py-2.5"><span className="grid h-8 w-8 place-items-center rounded-md bg-blue-50 text-[8px] font-bold uppercase text-brand">{item.appliedAt ? new Date(item.appliedAt).toLocaleDateString('en', { month: 'short', day: '2-digit' }) : 'Next'}</span><div className="flex-1"><strong className="block text-[10px]">{item.company}</strong><span className="text-[9px] text-slate-400">{item.role}</span></div><span className="text-[9px] text-slate-400">{index === 0 ? '2:00 PM' : '11:00 AM'}</span></div>)}</div></Card>
        </div>
      </div>
    </main>
  </div>;
}

function OverviewStat({ icon: Icon, label, value, note, color }) {
  return <Card className="p-3"><div className="flex items-start justify-between"><div><span className="block text-[9px] text-slate-500">{label}</span><strong className="mt-3 block text-lg">{value}</strong><small className="mt-1 block text-[8px] text-slate-400">{note}</small></div><span className={`grid h-5 w-5 place-items-center rounded-md ${color}`}><Icon size={11} /></span></div></Card>;
}

function PanelTitle({ title, subtitle, action }) {
  return <div className="flex items-start justify-between"><div><h2 className="text-[11px] font-bold">{title}</h2><p className="mt-1 text-[8px] text-slate-400">{subtitle}</p></div>{action && <button className="text-[8px] font-bold text-brand">{action}</button>}</div>;
}

function StatusPill({ status }) {
  const colors = { offer: 'bg-emerald-50 text-emerald-600', interview: 'bg-emerald-50 text-emerald-600', applied: 'bg-blue-50 text-brand', rejected: 'bg-rose-50 text-rose-500', screening: 'bg-violet-50 text-violet-500' };
  return <span className={`rounded-full px-2 py-1 text-[8px] font-bold capitalize ${colors[status] || 'bg-slate-100 text-slate-500'}`}>{status}</span>;
}
