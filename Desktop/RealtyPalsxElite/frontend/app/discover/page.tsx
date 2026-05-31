'use client';

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DiscoveryContent from '@/components/DiscoveryContent';
import { createClient } from '@/lib/supabase';

export default function DiscoverPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.user) {
        localStorage.removeItem('user_id');
        router.replace('/auth');
        return;
      }
      const uid = data.session.user.id;
      localStorage.setItem('user_id', uid);
      setUserId(uid);
      setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        localStorage.removeItem('user_id');
        router.replace('/auth');
      } else {
        const uid = session.user.id;
        localStorage.setItem('user_id', uid);
        setUserId(uid);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-[#E6E6E6]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] bg-[#E6E6E6] overflow-hidden no-overscroll">
      <Sidebar userId={userId} />
      <main className="flex-1 h-full flex flex-col min-h-0 overflow-hidden relative">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center text-gray-500">Loading...</div>}>
          <DiscoveryContent userId={userId} />
        </Suspense>
      </main>
    </div>
  );
}
