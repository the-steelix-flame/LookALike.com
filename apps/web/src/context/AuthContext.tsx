'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/config'; // FIX: Removed .ts from the end

// Define the shape of the context data
interface AuthContextType {
    user: User | null;
    loading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged is a real-time listener from Firebase
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user ? user : null);
            setLoading(false);
        });

        // Cleanup the subscription when the component unmounts
        return () => unsubscribe();
    }, []); // Empty dependency array ensures this runs only once on mount

    const value = { user, loading };

    // Show a loading indicator while Firebase is checking the auth state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-background">
                {/* You can use any loading spinner here */}
                <p className="text-text">Loading...</p>
            </div>
        );
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook for easy access to the context
export const useAuth = () => useContext(AuthContext);
