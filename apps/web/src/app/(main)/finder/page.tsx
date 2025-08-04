'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface MatchResult {
  id: string;
  display_name: string;
  profile_pic_url: string;
  similarity: number;
}

export default function FinderPage() {
  const [image, setImage] = useState<string | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSearch = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const aiServiceUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL;
      const embeddingRes = await fetch(`${aiServiceUrl}/generate_embedding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: image }),
      });

      if (!embeddingRes.ok) {
        const errorData = await embeddingRes.json();
        throw new Error(errorData.error || 'Failed to analyze the image.');
      }

      const { embedding } = await embeddingRes.json();

      const searchRes = await fetch('/api/search/lookalike', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embedding }),
      });

      if (!searchRes.ok) {
        throw new Error('Failed to retrieve matches from the database.');
      }

      const data = await searchRes.json();
      setResults(data.results);

      if (data.results.length === 0) {
        setError("No matches found in our database.");
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during the search.");
      }
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{padding: '3rem 1.5rem'}}>
      <div className="card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem'}}>
        <h2 style={{fontSize: '1.875rem', fontWeight: '600', marginBottom: '1rem'}}>Find Your Lookalike!</h2>
        <p style={{marginBottom: '1.5rem', color: 'var(--text-light-color)', maxWidth: '500px', textAlign: 'center'}}>
          Upload a clear photo of a face to see who they look like from our featured users.
        </p>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          style={{marginBottom: '1rem'}}
        />
        {image && <Image src={image} alt="Uploaded preview" width={200} height={200} style={{marginBottom: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px var(--shadow-color)', objectFit: 'cover'}} />}
        
        <button 
          onClick={handleSearch} 
          disabled={!image || loading} 
          className="btn btn-primary"
        >
          {loading ? 'Analyzing & Searching...' : 'Find My Lookalike'}
        </button>

        {error && !loading && <p style={{color: 'var(--danger-color)', marginTop: '1rem', fontWeight: '600'}}>{error}</p>}

        {results.length > 0 && (
          <div style={{marginTop: '2rem', width: '100%'}}>
              <h3 style={{fontSize: '1.5rem', fontWeight: '600', textAlign: 'center', marginBottom: '1rem'}}>Top Matches</h3>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem'}}>
                  {results.map(result => (
                      <div key={result.id} className="card" style={{textAlign: 'center'}}>
                      <Image 
                          src={result.profile_pic_url || 'https://picsum.photos/128'} 
                          alt={result.display_name}
                          width={128}
                          height={128}
                          style={{borderRadius: '9999px', margin: '0 auto 0.5rem', objectFit: 'cover'}}
                      />
                      <p style={{fontWeight: '600', fontSize: '1.125rem'}}>{result.display_name}</p>
                      <p style={{fontSize: '0.875rem', color: '#16A34A', fontWeight: '700'}}>Similarity: {(result.similarity * 100).toFixed(2)}%</p>
                      </div>
                  ))}
              </div>
          </div>
        )}
      </div>
    </div>
  );
};