'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// The UserProfile interface was removed as the type is handled by the AuthContext.

export default function ProfilePage() {
  const { user, profile, loading, hasCompletedOnboarding } = useAuth();
  const router = useRouter(); // This is used for redirects.

  const [displayName, setDisplayName] = useState('');
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setProfilePicPreview(profile.profile_pic_url || null);
    }
  }, [profile]);

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

    let profilePicUrl = profile?.profile_pic_url;
    let profilePic_base64: string | null = null;

    if (profilePicFile) {
      try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signatureResponse = await fetch('/api/sign-cloudinary-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paramsToSign: { timestamp } }),
        });
        const { signature } = await signatureResponse.json();

        const formData = new FormData();
        formData.append('file', profilePicFile);
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
        formData.append('signature', signature);
        formData.append('timestamp', timestamp.toString());

        const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const cloudinaryData = await cloudinaryResponse.json();
        profilePicUrl = cloudinaryData.secure_url;

        profilePic_base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(profilePicFile);
        });

      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
        setIsSaving(false);
        return;
      }
    }
    
    try {
      const response = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.uid, 
          displayName,
          profilePicUrl,
          profilePic_base64
        }),
      });

      if (!response.ok) throw new Error('Failed to save changes.');

      alert('Profile updated successfully!');
    } catch (error) {
      // FIX: Check if the error is an instance of Error before using .message
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (window.confirm('Are you sure you want to delete your account? This is permanent.')) {
        try {
            await fetch('/api/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid }),
            });
            alert('Account deleted successfully. You will be logged out.');
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

  if (!user || !hasCompletedOnboarding) {
    router.push('/onboarding');
    return null;
  }

  return (
    <div className="profile-page">
      <h1 style={{fontSize: '2.25rem', fontWeight: 'bold', textAlign: 'center'}}>Manage Your Profile</h1>
      
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Image 
          src={profilePicPreview || 'https://picsum.photos/128'} 
          alt="Current profile picture"
          width={128}
          height={128}
          style={{borderRadius: '9999px', objectFit: 'cover'}}
        />
      </div>

      <form onSubmit={handleSaveChanges} className="profile-card profile-form">
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="profilePic">Update Profile Picture</label>
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-input"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSaving}
          className="btn btn-primary"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="danger-zone">
        <h2 style={{fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem'}}>Danger Zone</h2>
        <button
          onClick={handleDeleteAccount}
          className="btn btn-danger"
        >
          Delete My Account
        </button>
      </div>
    </div>
  );
}
