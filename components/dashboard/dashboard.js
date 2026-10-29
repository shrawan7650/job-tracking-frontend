import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, BriefcaseBusiness, CalendarDays, ChartNoAxesColumnIncreasing, Menu, Plus, Search, Sparkles } from 'lucide-react';
import { clearAccessToken, createApplication, deleteApplication, getAccessToken, getApplications, getCurrentUser } from '../../lib/api';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Sidebar } from '../layout/sidebar';
import { StatCard } from './stat-card';
import { ApplicationTable } from './application-table';
import { ApplicationDialog } from './application-dialog';

const statuses = ['all', 'saved', 'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'];

export function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    let active = true;

    async function verifySession() {
      if (!getAccessToken()) {
        window.location.replace('/signup');
        return;
      }

      try {
        await getCurrentUser();
        if (active) setAuthenticated(true);
      } catch (sessionError) {
        if (sessionError.status === 401) {
          clearAccessToken();
          window.location.replace('/signup');
          return;
        }

        if (active) {
          setError('We could not verify your session. Check the backend connection and retry.');
        }
      } finally {
        if (active) setCheckingAuth(false);
      }
    }

    verifySession();
    return () => { active = false; };
  }, []);

  const load = useCallback(async () => {
    if (!authenticated) return;
    setLoading(true);
    try { setApplications((await getApplications({ status, search })).data || []); setError(''); }
    catch (loadError) {
      if (loadError.status === 401) {
        clearAccessToken();
        window.location.replace('/signup');
        return;
      }
      setError(`${loadError.message}. Check that the backend and MongoDB are running.`);
    }
    finally { setLoading(false); }
  }, [authenticated, status, search]);

  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);

  const summary = useMemo(() => ({
    total: applications.length,
    active: applications.filter((item) => !['rejected', 'withdrawn'].includes(item.status)).length,
    interviews: applications.filter((item) => item.status === 'interview').length,
    offers: applications.filter((item) => item.status === 'offer').length
  }), [applications]);

  async function addApplication(data) { await createApplication(data); setShowDialog(false); load(); }
  async function removeApplication() { await deleteApplication(selected._id); setSelected(null); load(); }

  if (checkingAuth || !authenticated) return <div className="grid min-h-screen place-items-center bg-canvas text-sm text-slate-500">Checking your secure workspace...</div>;

  return <div className="flex min-h-screen bg-canvas text-ink"><Sidebar total={summary.total} activeLabel="Applications" open={sidebarOpen} collapsed={sidebarCollapsed} onClose={() => setSidebarOpen(false)} onToggle={() => setSidebarCollapsed((value) => !value)} /><main className="min-w-0 flex-1"><header className="flex h-[78px] items-center justify-between border-b border-slate-100 bg-white px-4 sm:px-6 lg:px-[5.2%]"><div className="flex items-center gap-3 text-xs text-slate-400"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={19} /></Button><span>Workspace</span><b className="font-normal text-slate-300">/</b><strong className="text-slate-600">Applications</strong></div><div className="flex items-center gap-2 sm:gap-5"><Button variant="ghost" size="icon"><Bell size={17} /></Button><div className="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-[10px] font-bold text-white">AK</div></div></header><div className="  py-2 lg:px-[2%]"><div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[1.3px] text-slate-400">Thursday, October 29, 2026</p><h1 className="text-3xl font-bold tracking-tight">Your job search, <em className="font-display text-brand">in focus.</em></h1><p className="mt-2 text-sm text-slate-400">One clear view of every opportunity and what comes next.</p></div><Button onClick={() => setShowDialog(true)}><Plus size={16} /> Add application</Button></div>{error && <div className="mt-5 flex items-center justify-between rounded-lg bg-rose-50 px-4 py-3 text-xs text-rose-600"><span>{error}</span><Button variant="ghost" size="sm" onClick={load}>Retry</Button></div>}<div className="my-9 grid grid-cols-2 gap-3 xl:grid-cols-4"><StatCard icon={BriefcaseBusiness} color="bg-indigo-50 text-indigo-500" label="Total applications" value={summary.total} note="Across your workspace" /><StatCard icon={ChartNoAxesColumnIncreasing} color="bg-violet-50 text-violet-500" label="Active pipeline" value={summary.active} note="Opportunities in motion" /><StatCard icon={CalendarDays} color="bg-orange-50 text-orange-500" label="Interviews" value={summary.interviews} note="Keep the momentum" /><StatCard icon={Sparkles} color="bg-emerald-50 text-emerald-500" label="Offers" value={summary.offers} note="Great work" /></div><div className="mb-4 flex items-end justify-between"><div><h2 className="text-lg font-bold tracking-tight">Application pipeline</h2><p className="mt-1 text-xs text-slate-400">Track every opportunity from first look to offer.</p></div></div><Card className="mb-10 p-5"><div className="flex h-2 gap-1 overflow-hidden rounded-full">{statuses.slice(1).map((item) => <div key={item} className={`min-w-1 rounded-full ${item === 'offer' ? 'bg-emerald-400' : item === 'interview' ? 'bg-orange-300' : item === 'screening' ? 'bg-violet-400' : item === 'applied' ? 'bg-indigo-400' : 'bg-slate-300'}`} style={{ flex: Math.max(applications.filter((application) => application.status === item).length, .4) }} />)}</div><div className="mt-4 flex flex-wrap gap-5 text-[10px] text-slate-400">{statuses.slice(1).map((item) => <span key={item}><i className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current" />{item} <b className="text-slate-600">{applications.filter((application) => application.status === item).length}</b></span>)}</div></Card><div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-lg font-bold tracking-tight">All applications</h2><p className="mt-1 text-xs text-slate-400">{applications.length} opportunities in view</p></div><div className="flex w-full gap-2 sm:w-auto"><div className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-slate-400 sm:w-56 sm:flex-none"><Search size={15} /><input className="w-full bg-transparent text-xs outline-none" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search companies..." /></div></div></div><div className="mb-0 flex gap-6 overflow-auto  border-slate-200">{statuses.map((item) => <button key={item} onClick={() => setStatus(item)} className={`relative whitespace-nowrap pb-3 text-[11px] capitalize ${status === item ? 'font-bold text-brand after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-brand' : 'text-slate-400'}`}>{item}</button>)}</div><ApplicationTable applications={applications} loading={loading} onSelect={setSelected} /></div></main>{showDialog && <ApplicationDialog onClose={() => setShowDialog(false)} onSubmit={addApplication} />}{selected && <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={() => setSelected(null)}><div className="h-full w-full max-w-md bg-white p-9 shadow-2xl" onClick={(event) => event.stopPropagation()}><button className="float-right text-2xl text-slate-400" onClick={() => setSelected(null)}>×</button><div className="mb-8 grid h-12 w-12 place-items-center rounded-lg bg-indigo-50 font-bold text-indigo-500">{selected.company.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase()}</div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{selected.source} source</p><h2 className="mt-2 text-2xl font-bold">{selected.role}</h2><p className="mt-1 text-sm text-slate-500">{selected.company}</p><div className="mt-5 rounded-lg bg-slate-50 p-4 text-xs leading-6 text-slate-600"><b className="capitalize">{selected.status}</b><br />{selected.location || 'Location not specified'}<br />{selected.notes || 'No notes added'}</div><Button variant="danger" className="mt-6" onClick={removeApplication}>Delete application</Button></div></div>}</div>;
}
