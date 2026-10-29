import { Card } from '../ui/card';

export function StatCard({ icon: Icon, color, label, value, note }) {
  return <Card className="flex gap-3 p-4"><div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${color}`}><Icon size={16} /></div><div><span className="block text-[10px] text-slate-400">{label}</span><strong className="mt-1 block text-2xl tracking-tight">{value}</strong><small className="text-[10px] text-slate-400">{note}</small></div></Card>;
}
