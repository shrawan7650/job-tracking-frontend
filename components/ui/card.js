import { cn } from '../../lib/utils';

export function Card({ className, ...props }) {
  return <div className={cn('rounded-xl border border-slate-200/80 bg-white', className)} {...props} />;
}
