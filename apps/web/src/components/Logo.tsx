import Link from 'next/link';
import React from 'react';
import Image from 'next/image'; // Import the Next.js Image component for optimization

export const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-text hover:text-accent transition-colors">
            {/* This Image component will automatically serve the favicon.ico file 
        located in your apps/web/src/app/ directory.
      */}
            <Image
                src="/favicon.ico"
                alt="Lookalike Logo"
                width={32}
                height={32}
                className="rounded-full"
            />
            <span>Look-A-Like</span>
        </Link>
    );
};
