import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { authenticateWithGoogle, getAccessToken, getCurrentUser } from '../../lib/api';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function SignupPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) return;

    getCurrentUser()
      .then(() => { window.location.replace('/dashboard'); })
      .catch(() => {});
  }, []);

  async function handleGoogleSuccess(response) {
    if (!response.credential) {
      setMessage('Google did not return an ID token. Please try again.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      await authenticateWithGoogle(response.credential);
      window.location.href = '/dashboard';
    } catch (error) {
      setMessage(error.message || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleError() {
    setMessage('Google sign-in was cancelled or could not be completed.');
  }

  return <main className="grid min-h-screen bg-white lg:grid-cols-2"><section className="relative hidden overflow-hidden bg-[#182338] p-10 text-white lg:flex lg:flex-col lg:justify-between"><div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#4168ee]/30 blur-3xl" /><div className="relative"><Link href="/" className="flex items-center gap-2 text-xl font-bold"><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#4168ee]">◈</span> orbit</Link><div className="mt-28 max-w-md"><p className="mb-5 text-xs font-bold uppercase tracking-[1.5px] text-[#9eb2ff]">A clearer search starts here</p><h1 className="text-5xl font-bold leading-tight tracking-[-2px]">Your next opportunity is closer than you think.</h1><p className="mt-6 text-base leading-7 text-slate-300">Create your personal workspace and turn the noise of job hunting into a plan you can actually follow.</p><div className="mt-9 grid gap-4 text-sm text-slate-200">{['Keep every application in one place', 'Know exactly what needs your attention', 'Build momentum without burning out'].map((item) => <div key={item} className="flex items-center gap-3"><span className="grid h-5 w-5 place-items-center rounded-full bg-[#4168ee]"><Check size={13} /></span>{item}</div>)}</div></div></div><p className="relative text-xs text-slate-400">© 2026 Orbit · Built for your next chapter</p></section><section className="flex items-center justify-center px-6 py-12"><div className="w-full max-w-[410px]"><Link href="/" className="mb-14 inline-flex items-center gap-2 text-xs font-bold text-slate-400 transition hover:text-[#4168ee]"><ArrowLeft size={15} /> Back to home</Link><div className="mb-9 lg:hidden"><Link href="/" className="flex items-center gap-2 text-xl font-bold"><span className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#4168ee] text-white">◈</span> orbit</Link></div><p className="mb-3 text-xs font-bold uppercase tracking-[1.3px] text-[#5574dc]">Welcome to Orbit</p><h2 className="text-3xl font-bold tracking-tight text-[#182338]">Start your workspace.</h2><p className="mt-3 text-sm leading-6 text-slate-500">One account for a calmer, more focused job search.</p>{GOOGLE_CLIENT_ID ? <div className="mt-9"><GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap={false} theme="outline" size="large" width="410" text="continue_with" /></div> : <div className="mt-9 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-800">Google sign-in is not configured yet. Add <code className="font-bold">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> to <code className="font-bold">.env.local</code>, then restart the frontend.</div>}{loading && <p className="mt-3 text-center text-xs text-slate-400">Finishing your secure sign-in...</p>}{message && <div className="mt-4 rounded-lg bg-indigo-50 p-3 text-xs leading-5 text-indigo-700">{message}</div>}<div className="my-8 flex items-center gap-3 text-[10px] text-slate-300"><span className="h-px flex-1 bg-slate-200" />ONLY GOOGLE SIGN-UP<span className="h-px flex-1 bg-slate-200" /></div><div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-xs text-slate-500"><div className="flex gap-2"><ShieldCheck size={16} className="shrink-0 text-emerald-500" /> No password to remember. Use your trusted Google account.</div><div className="flex gap-2"><LockKeyhole size={16} className="shrink-0 text-[#4168ee]" /> Your workspace stays private and belongs to you.</div></div><p className="mt-8 text-center text-xs text-slate-400">Already have an account? <span className="font-bold text-[#4168ee]">Sign in with Google above</span></p><p className="mt-7 text-center text-[10px] leading-5 text-slate-400">By continuing, you agree to Orbit&apos;s Terms and Privacy Policy.</p></div></section></main>;
}
