'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DiscoveryContent from '@/components/DiscoveryContent';

export default function DiscoverPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (!storedUserId) {
      router.replace('/');
      return;
    }
    setUserId(storedUserId);
  }, [router]);

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
