import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '../ui/button';

export function ApplicationDialog({ onClose, onSubmit }) {
  const [form, setForm] = useState({ source: 'manual', status: 'saved' });
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  return <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={onClose}><form onSubmit={(event) => { event.preventDefault(); onSubmit(form); }} onClick={(event) => event.stopPropagation()} className="w-full h-full max-w-md overflow-auto bg-white shadow-2xl p-9"><div className="flex items-start justify-between mb-7"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[1.3px] text-slate-400">New opportunity</p><h2 className="text-2xl font-bold tracking-tight">Add application</h2></div><Button type="button" variant="ghost" size="icon" onClick={onClose}><X size={18} /></Button></div><div className="grid grid-cols-2 gap-4"><Field label="Company" name="company" required onChange={update} placeholder="Acme Inc." /><Field label="Role" name="role" required onChange={update} placeholder="Product Designer" /><Select label="Source" name="source" value={form.source} onChange={update} options={['manual', 'gmail', 'share', 'browser']} /><Select label="Status" name="status" value={form.status} onChange={update} options={['saved', 'applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn']} /><Field label="Applied date" name="appliedAt" type="date" onChange={update} /><Field label="Location" name="location" onChange={update} placeholder="Remote or city" /><Field label="Job URL" name="jobUrl" type="url" onChange={update} placeholder="https://..." full /><label className="col-span-2 text-[11px] font-bold text-slate-600">Notes<textarea name="notes" onChange={update} rows="4" className="mt-2 block w-full resize-y rounded-md border border-slate-200 p-2.5 text-xs outline-none focus:border-brand" placeholder="Add context or next steps..." /></label></div><Button className="mt-7" type="submit">Save application <ArrowRight size={15} /></Button></form></div>;
}

function Field({ label, full, ...props }) {
  return <label className={`${full ? 'col-span-2' : ''} text-[10px] font-bold text-slate-600`}>{label}<input className="mt-2 block w-full rounded-md border border-slate-200 p-2.5 text-xs outline-none focus:border-brand" {...props} /></label>;
}

function Select({ label, options, ...props }) {
  return <label className="text-[11px] font-bold capitalize text-slate-600">{label}<select className="mt-2 block w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-brand" {...props}>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}
