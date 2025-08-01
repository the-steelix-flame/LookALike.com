'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, displayName }),
      });

      if (!response.ok) throw new Error('Failed to save changes.');

      alert('Profile updated successfully!');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // ... delete logic ...
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl px-6 py-8 space-y-8">
      <h1 className="text-4xl font-bold text-text text-center">Manage Your Profile</h1>

      <form onSubmit={handleSaveChanges} className="p-8 bg-primary rounded-lg shadow-lg space-y-6">
        <div>
          <label htmlFor="displayName" className="block text-lg font-semibold text-text mb-2">Display Name</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="profilePic" className="block text-lg font-semibold text-text mb-2">Profile Picture</label>
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-dark"
          />
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-accent text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-accent-dark disabled:bg-gray-400"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="p-6 bg-red-100 border border-red-400 rounded-lg">
        <h2 className="text-2xl font-semibold text-red-800 mb-4">Danger Zone</h2>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700"
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
}
