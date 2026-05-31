'use client';

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';

type Mode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        localStorage.setItem('user_id', data.session.user.id);
        router.replace('/discover');
      } else {
        setChecking(false);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'login') {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        if (data.user) {
          localStorage.setItem('user_id', data.user.id);
          router.push('/discover');
        }
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name.trim() || email.split('@')[0] } },
        });
        if (authError) throw authError;
        if (data.user?.identities?.length === 0) {
          setError('An account with this email already exists. Please sign in.');
        } else {
          setMessage('Account created! Check your email for a confirmation link, then sign in.');
          setMode('login');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-black">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/newBg.jpeg"
          alt="background"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Blobs */}
      <div className="absolute top-[15%] left-[20%] w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[15%] w-[350px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo/realtypals.png"
            alt="RealtyPals"
            width={56}
            height={56}
            className="drop-shadow-lg"
          />
        </div>

        {/* Card */}
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex bg-white/[0.05] rounded-xl p-1 mb-8">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setMessage(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                required
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
                required
                minLength={6}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <span className="text-red-400 text-xs leading-relaxed">{error}</span>
              </div>
            )}

            {message && (
              <div className="flex items-start gap-2.5 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                <span className="text-green-400 text-xs leading-relaxed">{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setMessage(''); }}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          AI-powered real estate advisor for Noida
        </p>
      </div>
    </div>
  );
}
