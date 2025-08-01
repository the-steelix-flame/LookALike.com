'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { Logo } from './Logo';

export const Header = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    // FIX: Changed background to 'bg-primary' to make it visible
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <Link href="/finder" className="font-semibold text-text hover:text-accent transition-colors">
            Finder
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="font-semibold text-text hover:text-accent transition-colors">
                Profile
              </Link>
              <button onClick={handleSignOut} className="bg-accent text-white px-4 py-2 rounded-lg font-bold hover:bg-accent-dark transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-accent text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-dark transition-transform hover:scale-105 inline-block">
              Login / Sign Up
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};
