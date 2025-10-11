'use client';

import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LogOut,
  Settings,
  Wallet,
  Loader2,
} from 'lucide-react';
import { MainNav } from '@/components/main-nav';
import { Chatbot } from '@/components/chatbot';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    // Only run this logic on the client side after the initial render.
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans">
      <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg text-primary-foreground">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-semibold">AI CASH</h1>
        </div>
        <Avatar className="h-9 w-9 cursor-pointer" onClick={() => router.push('/profile')}>
          <AvatarImage src={user.photoURL || "https://picsum.photos/seed/user-avatar/40/40"} data-ai-hint="profile picture" />
          <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
      </header>
      <main className="flex-1 p-4 mb-16">
          {children}
      </main>
      <Chatbot />
      <footer className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t z-20">
        <MainNav />
      </footer>
    </div>
  );
}
