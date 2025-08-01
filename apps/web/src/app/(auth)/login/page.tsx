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
        // This effect now only handles existing users who land on this page.
        // The redirect for new users is handled by the auth functions below.
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
                    router.push('/onboarding'); // Redirect new users to onboarding
                }
            } else {
                await signInWithEmail(email, password);
                router.push('/profile'); // Existing user goes to their profile
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
                router.push('/onboarding'); // New user from Google goes to onboarding
            } else {
                router.push('/profile'); // Existing user goes to their profile
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
        <div className="w-full max-w-md p-8 space-y-6 bg-background rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-center text-text">
                {isSigningUp ? 'Create an Account' : 'Welcome Back!'}
            </h1>

            <button onClick={handleGoogleSignIn} className="w-full btn btn-google flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" width={20} height={20} />
                Sign in with Google
            </button>

            <div className="flex items-center text-center">
                <hr className="flex-grow border-gray-300" />
                <span className="px-4 text-gray-500">OR</span>
                <hr className="flex-grow border-gray-300" />
            </div>

            <form onSubmit={handleAuthAction} className="space-y-4">
                {isSigningUp && (
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your Name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                )}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button type="submit" className="w-full bg-accent text-white py-2 rounded-lg font-bold hover:bg-accent-dark">
                    {isSigningUp ? 'Sign Up' : 'Login'}
                </button>
            </form>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <p className="text-center text-text">
                {isSigningUp ? 'Already have an account?' : "Don't have an account?"}
                <button onClick={() => setIsSigningUp(!isSigningUp)} className="font-bold text-accent hover:underline ml-2">
                    {isSigningUp ? 'Login' : 'Sign Up'}
                </button>
            </p>
        </div>
    );
}
