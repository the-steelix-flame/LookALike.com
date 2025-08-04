'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { Logo } from './Logo';

export const Header = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    setIsMenuOpen(false); // Close menu on logout
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="header-nav">
          <Logo />
          
          {/* Hamburger Menu Button for Mobile */}
          <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {/* Simple SVG for the 3 bars */}
            <svg stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 24 24" height="1em" width="4em" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path>
            </svg>
          </button>

          {/* Navigation Links */}
          <div className={`nav-links-container ${isMenuOpen ? 'is-open' : ''}`}>
            <div className="nav-links">
              <Link href="/#how-it-works" className="nav-link" onClick={() => setIsMenuOpen(false)}>How It Works</Link>
              <Link href="/#features" className="nav-link" onClick={() => setIsMenuOpen(false)}>Features</Link>
              <Link href="/finder" className="nav-link" onClick={() => setIsMenuOpen(false)}>Finder</Link>
              {user ? (
                <>
                  <Link href="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                  <button onClick={handleSignOut} className="btn btn-primary">Logout</button>
                </>
              ) : (
                <Link href="/login" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>Login / Sign Up</Link>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
