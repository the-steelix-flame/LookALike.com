'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ImageCapture } from '@/components/ImageCapture';

export default function OnboardingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="p-8 bg-primary rounded-lg shadow-lg text-center">
                <h1 className="text-4xl font-bold text-text mb-4">Welcome, {user.displayName}!</h1>
                <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                    Let&apos;s build your face profile. This is a one-time setup that allows our AI to find your lookalikes. Please use your webcam for live capture or upload a few high-quality photos.
                </p>
                <ImageCapture />
            </div>
        </div>
    );
}
