'use client';

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { TotalUserCounter } from '@/components/TotalUserCounter'; // Import the new component

const HeroSection = () => (
  <section style={{ textAlign: 'center', padding: '5rem 1.5rem', backgroundColor: 'var(--primary-color)' }}>
    <h1 style={{ fontSize: '3.75rem', fontWeight: '800', marginBottom: '1rem' }}>Find Your Digital Twin</h1>
    <p style={{ fontSize: '1.25rem', color: 'var(--text-light-color)', marginBottom: '2rem', maxWidth: '768px', margin: '0 auto 2rem' }}>
      Join our community to find your doppelgänger! Our AI scans users and celebrities to discover who you look like, and helps them find you too.
    </p>
    <Link href="/finder" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
      Find Your Lookalike Now
    </Link>
    <div style={{display: 'flex', justifyContent: 'center'}}>
        <TotalUserCounter />
    </div>
  </section>
);

const SeeTheMagicSection = () => (
  <section style={{ padding: '5rem 0' }}>
    <div className="container" style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '3rem' }}>Real People, Real Matches</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
        <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px 0 var(--shadow-color)' }}>
          <Image src="/images/twins1.jpg" alt="Lookalike match example 1" width={600} height={600} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
        </div>
        <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px 0 var(--shadow-color)' }}>
          <Image src="/images/twins2.jpg" alt="Lookalike match example 2" width={600} height={600} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
        </div>
      </div>
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: 'var(--primary-color)' }}>
    <div className="container" style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '3rem' }}>How It Works</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>1. Upload a Photo</h3>
          <p>Choose a clear, front-facing photo of yourself for the best results.</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>2. AI Analysis</h3>
          <p>Our advanced AI model analyzes the unique features of your face.</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>3. Discover Matches</h3>
          <p>See your top matches and get your similarity score instantly.</p>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section id="features" style={{ padding: '5rem 0' }}>
    <div className="container" style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '3rem' }}>Why You&apos;ll Love Lookalike</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Easy Login</h3>
          <p>Get started in seconds with secure Google or Email sign-in.</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Instant Search</h3>
          <p>Find your lookalike without needing to create an account first.</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Connect & Have Fun</h3>
          <p>Discover your twin, connect with them through our future chat feature, and share the fun.</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>You&apos;re in Control</h3>
          <p>Easily manage your profile and delete your account and all data whenever you want.</p>
        </div>
      </div>
    </div>
  </section>
);

export default function LandingPage() {
  return (
    <div>
      <HeroSection />
      <SeeTheMagicSection />
      <HowItWorksSection />
      <FeaturesSection />
    </div>
  );
}
