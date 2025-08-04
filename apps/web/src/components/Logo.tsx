import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

export const Logo = () => {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
      <Image 
        src="/favicon.ico" 
        alt="Lookalike Logo" 
        width={32} 
        height={32} 
        style={{ borderRadius: '9999px' }}
      />
      <span style={{ 
        fontSize: '1.5rem', 
        fontWeight: '800', // Extra bold
        color: 'var(--accent-dark-color)', // Orange tint
        transition: 'color 0.2s'
      }}>
        Lookalike
      </span>
    </Link>
  );
};
