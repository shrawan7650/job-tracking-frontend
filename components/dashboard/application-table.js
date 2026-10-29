import { ArrowUpRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

const sourceLabels = { gmail: 'Gmail', share: 'Shared link', browser: 'Browser', manual: 'Manual' };

function formatDate(value) {
  if (!value) return 'Not applied';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function CompanyMark({ company }) {
  return <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-[10px] font-bold text-indigo-500">{company?.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase()}</div>;
}

export function ApplicationTable({ applications, loading, onSelect }) {
  if (loading) return <Card className="flex min-h-48 items-center justify-center text-xs text-slate-400">Loading applications...</Card>;
  if (!applications.length) return <Card className="flex min-h-48 flex-col items-center justify-center gap-2 text-xs text-slate-400"><strong className="text-slate-600">No applications found</strong><span>Try a different filter or add an application.</span></Card>;
  return <Card className="overflow-hidden">{applications.map((application) => <button key={application._id} onClick={() => onSelect(application)} className="grid w-full grid-cols-[2fr_1fr_1fr_105px_18px] items-center gap-3 border-b border-slate-100 px-5 py-4 text-left last:border-0 hover:bg-slate-50"><div className="flex items-center gap-3"><CompanyMark company={application.company} /><div><strong className="block text-xs">{application.company}</strong><span className="mt-1 block text-[11px] text-slate-400">{application.role}</span></div></div><span className="text-[11px] text-slate-400">{sourceLabels[application.source] || application.source}</span><span className="text-[11px] text-slate-400">{formatDate(application.appliedAt)}</span><Badge status={application.status} /><ArrowUpRight size={16} className="text-slate-300" /></button>)}</Card>;
}
