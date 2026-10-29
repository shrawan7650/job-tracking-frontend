import { cn } from '../../lib/utils';

export function Button({ className, variant = 'default', size = 'default', ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:pointer-events-none disabled:opacity-50',
        variant === 'default' && 'bg-brand text-white shadow-soft hover:bg-blue-700',
        variant === 'outline' && 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
        variant === 'ghost' && 'text-slate-500 hover:bg-slate-100',
        variant === 'danger' && 'text-rose-500 hover:bg-rose-50',
        size === 'default' && 'h-10 px-4',
        size === 'sm' && 'h-8 px-3',
        size === 'icon' && 'h-9 w-9 p-0',
        className
      )}
      {...props}
    />
  );
}
