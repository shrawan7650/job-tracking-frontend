
import Link from 'next/link';
import {
  BarChart3,
  Mail,
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = [
  { label: 'Overview', icon: Grid2X2, href: '/dashboard' },
  { label: 'Applications', icon: BriefcaseBusiness, href: '/applications' },
  { label: 'Email Sync', icon: Mail, href: '/email-sync' },
  { label: 'Follow-ups', icon: CalendarDays, href: '/follow-ups', count: 3 },
  { label: 'Insights', icon: BarChart3, href: '/insights' },
];

export function Sidebar({
  total = 0,
  open = false,
  collapsed = false,
  onClose,
  onToggle,
  activeLabel = 'Overview',
}) {
  return (
    <>
      {open && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 -translate-x-full flex-col border-r border-slate-100 bg-white px-4 py-6 shadow-2xl transition-all duration-200 lg:static lg:translate-x-0 lg:shadow-none',
          open && 'translate-x-0',
          collapsed && 'lg:w-[76px] lg:px-3'
        )}
      >
        <div
          className={cn(
            'flex items-center gap-2 px-3 pb-12 text-[23px] font-bold tracking-tight',
            collapsed && 'lg:justify-center lg:px-0'
          )}
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand text-white shadow-soft">
            ◈
          </span>
          <span className={cn(collapsed && 'lg:hidden')}>orbit</span>

          <button
            aria-label="Close navigation"
            onClick={onClose}
            className="ml-auto text-slate-400 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <p
          className={cn(
            'px-3 pb-3 text-[10px] font-bold uppercase tracking-[1.3px] text-slate-400',
            collapsed && 'lg:hidden'
          )}
        >
          Workspace
        </p>

        <nav className="grid gap-1">
          {navigation.map(({ label, icon: Icon, href, count }) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-3 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-50',
                activeLabel === label && 'bg-indigo-50 text-brand',
                collapsed && 'lg:justify-center lg:px-0'
              )}
            >
              <Icon size={17} strokeWidth={1.8} />

              <span className={cn(collapsed && 'lg:hidden')}>
                {label}
              </span>

              {(count !== undefined || label === 'Applications') && (
                <span
                  className={cn(
                    'ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500',
                    collapsed && 'lg:hidden'
                  )}
                >
                  {label === 'Applications' ? total : count}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <Link
            href="/settings"
            onClick={onClose}
            title={collapsed ? 'Settings' : undefined}
            className={cn(
              'flex items-center gap-3 px-3 py-3 text-xs font-semibold text-slate-400',
              collapsed && 'lg:justify-center lg:px-0'
            )}
          >
            <Settings size={17} />
            <span className={cn(collapsed && 'lg:hidden')}>
              Settings
            </span>
          </Link>

          <div
            className={cn(
              'mt-4 flex items-center gap-2 border-t border-slate-100 px-2 pt-4',
              collapsed && 'lg:justify-center lg:px-0'
            )}
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-100 text-[10px] font-bold text-brand">
              AK
            </div>

            <div className={cn('leading-tight', collapsed && 'lg:hidden')}>
              <strong className="block text-xs">Alex Kim</strong>
              <small className="text-[10px] text-slate-400">
                Personal workspace
              </small>
            </div>
          </div>
        </div>

        <button
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute right-3 top-3 hidden h-7 w-7 items-center justify-center rounded-md border border-slate-100 bg-white text-slate-400 shadow-sm hover:bg-slate-50 lg:flex"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>
    </>
  );
}
