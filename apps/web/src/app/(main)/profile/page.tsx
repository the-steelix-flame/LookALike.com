'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface UserProfile {
  display_name: string;
  profile_pic_url: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch the user's current profile data from our database
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const response = await fetch('/api/users/get-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.uid }),
          });
          if (response.ok) {
            const data = await response.json();
            setProfile(data.profile);
            setDisplayName(data.profile.display_name || '');
            setProfilePicPreview(data.profile.profile_pic_url || null);
          }
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    let profilePic_base64: string | null = null;
    if (profilePicFile) {
      profilePic_base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(profilePicFile);
      });
    }
    
    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.uid, 
          displayName,
          profilePic_base64
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save changes.');
      }

      alert('Profile updated successfully!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        try {
            await fetch('/api/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid }),
            });
            alert('Account deleted successfully. You will be logged out.');
            // This will trigger the onAuthStateChanged listener to log the user out
            await user.delete(); 
            router.push('/');
        } catch (error) {
            alert('Failed to delete account.');
            console.error(error);
        }
    }
  };

  if (loading || (user && !profile)) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl px-6 py-8 space-y-8">
      <h1 className="text-4xl font-bold text-text text-center">Manage Your Profile</h1>
      
      <div className="flex justify-center">
        <Image 
          src={profilePicPreview || 'https://placehold.co/128x128/FFFDE7/1F2937?text=No+Pic'} 
          alt="Current profile picture"
          width={128}
          height={128}
          className="rounded-full object-cover"
        />
      </div>

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
          <label htmlFor="profilePic" className="block text-lg font-semibold text-text mb-2">Update Profile Picture</label>
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
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
