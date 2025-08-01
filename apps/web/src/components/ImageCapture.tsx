'use client';

import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const videoConstraints = {
    width: 500,
    height: 500,
    facingMode: 'user',
};

type CaptureMode = 'live' | 'upload';

export const ImageCapture = () => {
    const { user } = useAuth();
    const router = useRouter();
    const webcamRef = useRef<Webcam>(null);
    const [images, setImages] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [captureMode, setCaptureMode] = useState<CaptureMode>('live');

    const capture = useCallback(() => {
        if (webcamRef.current && images.length < 50) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setImages(prev => [...prev, imageSrc]);
            }
        }
    }, [webcamRef, images]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            const imagePromises = filesArray.map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(imagePromises).then(base64Images => {
                setImages(prev => [...prev, ...base64Images].slice(0, 50));
            });
        }
    };

    const handleSubmit = async () => {
        if (!user || images.length === 0) {
            alert("Please provide images before submitting.");
            return;
        }
        setIsProcessing(true);
        try {
            const response = await fetch('/api/users/build-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, images_base64: images }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to build profile. Please try again.');
            }

            alert('Profile built successfully! You will now be redirected to your profile page.');
            router.push('/profile');

        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            }
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-4 bg-background rounded-lg shadow-inner w-full max-w-2xl mx-auto">
            <div className="flex border-b border-gray-300 w-full justify-center mb-4">
                <button
                    onClick={() => setCaptureMode('live')}
                    className={`px-6 py-2 font-semibold ${captureMode === 'live' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}
                >
                    Live Capture
                </button>
                <button
                    onClick={() => setCaptureMode('upload')}
                    className={`px-6 py-2 font-semibold ${captureMode === 'upload' ? 'border-b-2 border-accent text-accent' : 'text-gray-500'}`}
                >
                    Upload Photos
                </button>
            </div>

            {captureMode === 'live' ? (
                <div className="text-center w-full">
                    <p className="text-gray-600 mb-4">Capture up to 50 photos using your webcam.</p>
                    <div className="w-full max-w-sm mx-auto mb-4">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            mirrored={true}
                            className="rounded-lg w-full"
                        />
                    </div>
                    <button
                        onClick={capture}
                        disabled={images.length >= 50 || isProcessing}
                        className="bg-accent text-white px-6 py-2 rounded-lg font-bold hover:bg-accent-dark disabled:bg-gray-400"
                    >
                        Capture Photo ({images.length}/50)
                    </button>
                </div>
            ) : (
                <div className="text-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-600 mb-4">Upload 2-3 high-quality photos. More is better!</p>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent-dark cursor-pointer"
                    />
                </div>
            )}

            {images.length > 0 && (
                <div className="w-full mt-6">
                    <h3 className="font-semibold text-lg text-center mb-2">Image Preview ({images.length})</h3>
                    <div className="flex flex-wrap gap-2 justify-center p-4 bg-gray-100 rounded-lg max-h-48 overflow-y-auto">
                        {images.map((src, index) => (
                            <Image key={index} src={src} alt={`capture-${index}`} width={64} height={64} className="w-16 h-16 rounded-md object-cover" />
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={isProcessing}
                            className="bg-green-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-600 disabled:bg-gray-400"
                        >
                            {isProcessing ? 'Processing...' : 'Build My Profile'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
