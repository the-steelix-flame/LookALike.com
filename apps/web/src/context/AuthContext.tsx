'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter, usePathname } from 'next/navigation';

interface AppUserProfile {
    display_name: string;
    profile_pic_url: string;
    embedding: number[] | null; // We need to know if the embedding exists
}

interface AuthContextType {
    user: User | null;
    profile: AppUserProfile | null;
    loading: boolean;
    hasCompletedOnboarding: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    hasCompletedOnboarding: false
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<AppUserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // User is logged in, now fetch their profile from OUR database
                try {
                    const response = await fetch('/api/users/get-profile', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: firebaseUser.uid }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const userProfile = data.profile;
                        setProfile(userProfile);

                        // THE CORE LOGIC: Enforce onboarding
                        if (!userProfile.embedding && pathname !== '/onboarding') {
                            // If they have no embedding and aren't on the onboarding page, force them there.
                            router.push('/onboarding');
                        }
                    } else {
                        // New user who isn't in our DB yet, send to onboarding
                        router.push('/onboarding');
                    }
                } catch (error) {
                    console.error("Failed to fetch profile", error);
                }
            } else {
                // User is logged out
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router, pathname]);

    const hasCompletedOnboarding = !!profile?.embedding;

    return (
        <AuthContext.Provider value={{ user, profile, loading, hasCompletedOnboarding }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
