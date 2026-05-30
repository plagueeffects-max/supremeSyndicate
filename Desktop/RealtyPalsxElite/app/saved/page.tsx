'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Bookmark } from 'lucide-react';

export default function SavedPropertiesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (!storedUserId) { router.replace('/'); return; }
    setUserId(storedUserId);
  }, [router]);

  return (
    <div className="flex h-[100dvh] bg-[#E6E6E6] overflow-hidden">
      <Sidebar userId={userId} />
      <main className="flex-1 h-full flex flex-col min-h-0 overflow-hidden">
        <Header title="Saved Properties" onToast={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center">
            <Bookmark size={32} className="text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Saved Properties</h2>
          <p className="text-gray-500 max-w-sm">
            Properties you save during your chat will appear here. Start a conversation and shortlist your favourites.
          </p>
          <button
            onClick={() => router.push('/discover')}
            className="mt-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all text-sm"
          >
            Start Discovery
          </button>
        </div>
      </main>
    </div>
  );
}
