'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// Define a specific type for our search results
interface MatchResult {
    id: string;
    display_name: string;
    profile_pic_url: string;
    similarity: number;
}

export default function FinderPage() {
    const [image, setImage] = useState<string | null>(null);
    // Use the new MatchResult type for our state
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
            const embeddingRes = await fetch('/api/generate_embedding', {
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
        <div className="container mx-auto px-6 py-12">
            <div className="flex flex-col items-center p-8 bg-primary rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold mb-4 text-text">Find Your Lookalike!</h2>
                <p className="mb-6 text-gray-600 max-w-md text-center">
                    Upload a clear photo of a face to see who they look like from our featured users.
                </p>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-dark cursor-pointer"
                />
                {image && <Image src={image} alt="Uploaded preview" width={200} height={200} className="mb-4 rounded-lg shadow-md object-cover" />}

                <button
                    onClick={handleSearch}
                    disabled={!image || loading}
                    className="bg-accent text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-accent-dark disabled:bg-gray-400 transition-colors"
                >
                    {loading ? 'Analyzing & Searching...' : 'Find My Lookalike'}
                </button>

                {error && !loading && <p className="text-red-500 mt-4 font-semibold">{error}</p>}

                {results.length > 0 && (
                    <div className="mt-8 w-full">
                        <h3 className="text-2xl font-semibold text-center mb-4 text-text">Top Matches</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map(result => (
                                <div key={result.id} className="bg-background p-4 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform">
                                    <Image
                                        src={result.profile_pic_url || 'https://placehold.co/128x128/FFFDE7/1F2937?text=No+Image'}
                                        alt={result.display_name}
                                        width={128}
                                        height={128}
                                        className="w-32 h-32 rounded-full mx-auto mb-2 object-cover bg-gray-300"
                                    />
                                    <p className="font-semibold text-lg text-text">{result.display_name}</p>
                                    <p className="text-sm text-green-600 font-bold">Similarity: {(result.similarity * 100).toFixed(2)}%</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
