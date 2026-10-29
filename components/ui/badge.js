import { cn } from '../../lib/utils';

const variants = {
  saved: 'bg-slate-100 text-slate-500',
  applied: 'bg-indigo-50 text-indigo-600',
  screening: 'bg-violet-50 text-violet-600',
  interview: 'bg-orange-50 text-orange-600',
  offer: 'bg-emerald-50 text-emerald-600',
  rejected: 'bg-rose-50 text-rose-600',
  withdrawn: 'bg-slate-100 text-slate-500'
};

export function Badge({ status }) {
  return <span className={cn('inline-flex w-fit rounded-md px-2.5 py-1 text-[10px] font-bold capitalize', variants[status] || variants.saved)}>{status}</span>;
}
