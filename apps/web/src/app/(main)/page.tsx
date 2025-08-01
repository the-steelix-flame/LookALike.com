import Link from 'next/link';
import React from 'react';
import Image from 'next/image'; // Import the Next.js Image component

// --- Page Sections ---
const HeroSection = () => (
  <div className="text-center py-20 bg-primary">
    <h1 className="text-5xl font-extrabold text-text mb-4">Find Your Digital Twin</h1>
    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
      Ever wondered who you look like? Upload a photo and our AI will scan our database of users and celebrities to find your doppelgänger.
    </p>
    <Link href="/finder" className="bg-accent text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent-dark transition-transform hover:scale-105 inline-block">
      Find Your Lookalike Now
    </Link>
  </div>
);

const HowItWorksSection = () => (
  <div className="py-20 container mx-auto px-6 bg-background">
    <h2 className="text-4xl font-bold text-center mb-12 text-text">How It Works</h2>
    <div className="grid md:grid-cols-3 gap-8 text-center">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-2">1. Upload a Photo</h3>
        <p>Choose a clear, front-facing photo of yourself for the best results.</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-2">2. AI Analysis</h3>
        <p>Our advanced AI model analyzes the unique features of your face.</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-2">3. Discover Matches</h3>
        <p>See your top matches from our community and get your similarity score.</p>
      </div>
    </div>
  </div>
);

// NEW SECTION to display your local images
const SeeTheMagicSection = () => (
  <div className="py-20 bg-background">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-4xl font-bold mb-12 text-text">Real People, Real Matches</h2>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="rounded-lg overflow-hidden shadow-2xl">
          <Image src="/images/twins1.jpg" alt="Lookalike match example 1" width={600} height={600} className="w-full h-full object-cover" />
        </div>
        <div className="rounded-lg overflow-hidden shadow-2xl">
          <Image src="/images/twins2.jpg" alt="Lookalike match example 2" width={600} height={600} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  </div>
);

const AboutDeveloperSection = () => (
  <div className="bg-primary py-20">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-4xl font-bold mb-4 text-text">About the Developer</h2>
      <p className="text-lg text-gray-700 max-w-3xl mx-auto">
        This application was created by Akash Kumar, a passionate developer exploring the intersection of web technologies and artificial intelligence. The goal is to build fun, engaging, and technically interesting projects.
      </p>
    </div>
  </div>
);


// --- Main Page Component ---
export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <SeeTheMagicSection />
      <HowItWorksSection />
      <AboutDeveloperSection />
    </div>
  );
}
