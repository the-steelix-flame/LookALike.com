'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '@/lib/firebase/auth';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSigningUp) {
        if (!displayName) {
          setError("Display name is required for sign up.");
          return;
        }
        const { isNewUser } = await signUpWithEmail(email, password, displayName);
        if (isNewUser) {
          router.push('/onboarding');
        }
      } else {
        await signInWithEmail(email, password);
        router.push('/profile');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const result = await signInWithGoogle();
      if (result?.isNewUser) {
        router.push('/onboarding');
      } else {
        router.push('/profile');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during Google Sign-in.");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 style={{fontSize: '1.875rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1.5rem'}}>
          {isSigningUp ? 'Create an Account' : 'Welcome Back!'}
        </h1>
        
        <button onClick={handleGoogleSignIn} className="btn btn-google" style={{width: '100%'}}>
          <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" width={20} height={20} />
          Sign in with Google
        </button>

        <div className="auth-divider">OR</div>

        <form onSubmit={handleAuthAction} className="auth-form">
          {isSigningUp && (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your Name"
              required
              className="form-input"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="form-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="form-input"
          />
          <button type="submit" className="btn btn-primary">
            {isSigningUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        {error && <p style={{color: 'var(--danger-color)', textAlign: 'center'}}>{error}</p>}

        {/* FIX: Use the new auth-toggle class for side-by-side layout */}
        <div className="auth-toggle">
          <span>
            {isSigningUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button onClick={() => setIsSigningUp(!isSigningUp)} style={{fontWeight: 'bold', color: 'var(--accent-color)', background: 'none', border: 'none', cursor: 'pointer'}}>
            {isSigningUp ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
